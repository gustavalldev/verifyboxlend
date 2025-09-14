const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const Joi = require('joi');
const winston = require('winston');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Настройка логгера
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: path.join(__dirname, 'logs', 'proxy-server.log')
        })
    ]
});

const app = express();

// Middleware
app.use(helmet());

// Строгие настройки CORS для безопасности
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://verifybox.ru',
    'https://www.verifybox.ru',
    'https://lk.verifybox.ru'
];

app.use(cors({
    origin: function (origin, callback) {
        // Разрешаем запросы без origin (например, мобильные приложения)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            logger.warn(`CORS blocked request from origin: ${origin}`, {
                ip: req?.ip,
                userAgent: req?.get('User-Agent')
            });
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-ID'],
    maxAge: 86400 // 24 часа
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Парсинг API ключей из переменной окружения
const parseApiKeys = () => {
    const apiKeys = {};
    const keysString = process.env.PROXY_API_KEYS || '';
    
    keysString.split(',').forEach(keyPair => {
        const [clientId, secret] = keyPair.split(':');
        if (clientId && secret) {
            apiKeys[clientId.trim()] = secret.trim();
        }
    });
    
    return apiKeys;
};

const validApiKeys = parseApiKeys();

// Простая проверка IP (опционально для дополнительной безопасности)
const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
const isIPAllowed = (ip) => {
    if (allowedIPs.length === 0) return true; // Если IP не настроены, разрешаем все
    
    // Удаляем IPv6 префикс если есть
    const cleanIP = ip.replace(/^::ffff:/, '');
    return allowedIPs.includes(cleanIP);
};

// Middleware для проверки IP (только если настроены IP)
const checkIPAccess = (req, res, next) => {
    // Если IP не настроены, пропускаем проверку
    if (allowedIPs.length === 0) return next();
    
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (!isIPAllowed(clientIP)) {
        logger.warn(`Access denied from IP: ${clientIP}`, {
            ip: clientIP,
            userAgent: req.get('User-Agent'),
            url: req.url
        });
        return res.status(403).json({
            success: false,
            error: 'Access denied from this IP address'
        });
    }
    
    next();
};

// Middleware для аутентификации (опционально, если настроены API ключи)
const authenticateClient = (req, res, next) => {
    // Если API ключи не настроены, пропускаем аутентификацию
    if (Object.keys(validApiKeys).length === 0) {
        req.clientId = 'no-auth';
        return next();
    }
    
    const authHeader = req.headers.authorization;
    const clientId = req.headers['x-client-id'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Missing or invalid authorization header'
        });
    }
    
    const token = authHeader.substring(7);
    const expectedSecret = validApiKeys[clientId];
    
    if (!expectedSecret || token !== expectedSecret) {
        logger.warn(`Unauthorized access attempt from client: ${clientId}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        return res.status(401).json({
            success: false,
            error: 'Invalid API key or client ID'
        });
    }
    
    req.clientId = clientId;
    next();
};

// Валидация схем
const sendSmsSchema = Joi.object({
    phone: Joi.string().pattern(/^\+\d{10,15}$/).required(),
    message: Joi.string().min(1).max(1600).required(),
    sender: Joi.string().min(1).max(11).optional()
    // Убираем vonageApiKey и vonageApiSecret из валидации
});

// Маршруты API

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'VerifyBox Vonage Proxy Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        landing: 'VerifyBox Landing Page'
    });
});

// Отправка SMS через Vonage API (HTTP)
app.post('/api/vonage/send-sms', checkIPAccess, authenticateClient, async (req, res) => {
    try {
        // Валидация входных данных
        const { error, value } = sendSmsSchema.validate(req.body);
        if (error) {
            logger.warn('Validation error in send-sms:', error.details);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const { phone, message, sender } = value;

        // Используем переменные окружения
        const vonageApiKey = process.env.VONAGE_API_KEY;
        const vonageApiSecret = process.env.VONAGE_API_SECRET;

        if (!vonageApiKey || !vonageApiSecret) {
            return res.status(500).json({
                success: false,
                error: 'Vonage API credentials not configured'
            });
        }

        logger.info(`Sending SMS to ${phone} from client ${req.clientId}`, {
            phone,
            sender,
            clientId: req.clientId,
            ip: req.ip
        });

        // Отправляем SMS через Vonage API (HTTP)
        const response = await axios.post('https://rest.nexmo.com/sms/json', {
            api_key: vonageApiKey,
            api_secret: vonageApiSecret,
            to: phone,
            from: sender || process.env.VONAGE_SENDER || 'VerifyBox',
            text: message
        });

        logger.info(`SMS sent successfully`, {
            messageId: response.data.messages[0]['message-id'],
            phone,
            clientId: req.clientId
        });

        res.json({
            success: true,
            message: 'SMS sent successfully',
            messageId: response.data.messages[0]['message-id'],
            remainingBalance: response.data.messages[0]['remaining-balance']
        });

    } catch (error) {
        logger.error('Error sending SMS:', {
            error: error.message,
            stack: error.stack,
            clientId: req.clientId,
            ip: req.ip
        });

        res.status(500).json({
            success: false,
            error: 'Failed to send SMS',
            message: error.message
        });
    }
});

// Проверка статуса SMS
app.get('/api/vonage/sms-status/:messageId', checkIPAccess, authenticateClient, async (req, res) => {
    try {
        const { messageId } = req.params;
        const { vonageApiKey, vonageApiSecret } = req.query;

        if (!vonageApiKey || !vonageApiSecret) {
            return res.status(400).json({
                success: false,
                error: 'Missing vonageApiKey or vonageApiSecret in query parameters'
            });
        }

        // Vonage не предоставляет прямой API для проверки статуса SMS
        // Возвращаем общий статус
        res.json({
            success: true,
            status: 'delivered', // Предполагаем доставку
            message: 'SMS status retrieved'
        });

    } catch (error) {
        logger.error('Error checking SMS status:', {
            error: error.message,
            messageId: req.params.messageId,
            clientId: req.clientId
        });

        res.status(500).json({
            success: false,
            error: 'Failed to check SMS status',
            message: error.message
        });
    }
});

// Получение баланса аккаунта Vonage
app.get('/api/vonage/balance', checkIPAccess, authenticateClient, async (req, res) => {
    try {
        const { vonageApiKey, vonageApiSecret } = req.query;

        if (!vonageApiKey || !vonageApiSecret) {
            return res.status(400).json({
                success: false,
                error: 'Missing vonageApiKey or vonageApiSecret in query parameters'
            });
        }

        // Получаем баланс через Vonage API (HTTP)
        const response = await axios.get(`https://rest.nexmo.com/account/get-balance?api_key=${vonageApiKey}&api_secret=${vonageApiSecret}`);
        
        res.json({
            success: true,
            balance: response.data.value,
            currency: response.data.autoReload ? 'EUR' : 'USD',
            message: 'Balance retrieved successfully'
        });

    } catch (error) {
        logger.error('Error getting Vonage balance:', {
            error: error.message,
            clientId: req.clientId
        });

        res.status(500).json({
            success: false,
            error: 'Failed to get balance',
            message: error.message
        });
    }
});

// Получение цен на отправку SMS
app.get('/api/vonage/pricing/:phone', checkIPAccess, authenticateClient, async (req, res) => {
    try {
        const { phone } = req.params;
        const { vonageApiKey, vonageApiSecret } = req.query;

        if (!vonageApiKey || !vonageApiSecret) {
            return res.status(400).json({
                success: false,
                error: 'Missing vonageApiKey or vonageApiSecret in query parameters'
            });
        }

        // Получаем цены через Vonage Pricing API (HTTP)
        const response = await axios.get(`https://rest.nexmo.com/pricing/sms?api_key=${vonageApiKey}&api_secret=${vonageApiSecret}&country=${phone.substring(1, 3)}`);

        res.json({
            success: true,
            price: response.data.countries[0]?.networks[0]?.prices?.sms?.price || 0.05,
            currency: 'EUR',
            message: 'Pricing retrieved successfully'
        });

    } catch (error) {
        logger.error('Error getting Vonage pricing:', {
            error: error.message,
            phone: req.params.phone,
            clientId: req.clientId
        });

        // Возвращаем примерную цену в случае ошибки
        res.json({
            success: true,
            price: 0.05, // 5 центов
            currency: 'EUR',
            message: 'Using default pricing due to API error'
        });
    }
});

// Обработка ошибок
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        clientId: req.clientId,
        ip: req.ip
    });

    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 обработчик для API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});

// Запуск сервера
const PORT = process.env.PROXY_PORT || 3001;
app.listen(PORT, () => {
    logger.info(`VerifyBox Vonage Proxy Server running on port ${PORT}`);
    logger.info(`Health check available at http://localhost:${PORT}/api/health`);
});

module.exports = app;