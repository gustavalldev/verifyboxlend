const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const winston = require('winston');

// Настройка логирования
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/webhook.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3002;

// Секретный ключ для проверки подписи GitHub
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key-here';

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для проверки подписи GitHub
function verifyGitHubSignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];
    
    if (!signature) {
        logger.warn('Missing GitHub signature');
        return res.status(401).json({ error: 'Missing signature' });
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    if (signature !== expectedSignature) {
        logger.warn('Invalid GitHub signature');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
}

// Webhook endpoint для GitHub
app.post('/webhook/github', verifyGitHubSignature, (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    logger.info('GitHub webhook received', {
        event,
        ref: payload.ref,
        repository: payload.repository?.full_name,
        pusher: payload.pusher?.name
    });

    // Проверяем, что это push в main ветку
    if (event === 'push' && payload.ref === 'refs/heads/main') {
        logger.info('Push to main branch detected, starting deployment...');
        
        // Отправляем ответ GitHub сразу
        res.status(200).json({ message: 'Deployment started' });

        // Выполняем деплой асинхронно
        deployToServer();
    } else {
        logger.info('Event ignored', { event, ref: payload.ref });
        res.status(200).json({ message: 'Event ignored' });
    }
});

// Функция деплоя
function deployToServer() {
    logger.info('Starting deployment process...');
    
    const deployScript = `
        cd /var/www/verifyboxlending
        echo "🔄 Pulling latest changes..."
        git pull origin main
        
        echo "📦 Installing dependencies..."
        cd proxy
        npm install --production
        
        echo "🔄 Restarting PM2 proxy..."
        pm2 restart proxy
        
        echo "✅ Checking PM2 status..."
        pm2 status
        
        echo "📋 Recent logs:"
        pm2 logs proxy --lines 5
        
        echo "🎉 Deployment completed successfully!"
    `;

    exec(deployScript, (error, stdout, stderr) => {
        if (error) {
            logger.error('Deployment failed:', {
                error: error.message,
                stderr: stderr
            });
            return;
        }

        logger.info('Deployment completed successfully:', {
            stdout: stdout
        });
    });
}

// Health check endpoint
app.get('/webhook/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Запуск сервера
app.listen(PORT, () => {
    logger.info(`Webhook server started on port ${PORT}`);
    logger.info(`Webhook endpoint: http://localhost:${PORT}/webhook/github`);
    logger.info(`Health check: http://localhost:${PORT}/webhook/health`);
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
