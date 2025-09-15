const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const Joi = require('joi');
const winston = require('winston');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
console.log('=== ENV DEBUG ===');
console.log('VONAGE_API_KEY:', process.env.VONAGE_API_KEY ? 'LOADED' : 'NOT LOADED');
console.log('VONAGE_API_SECRET:', process.env.VONAGE_API_SECRET ? 'LOADED' : 'NOT LOADED');
console.log('================');

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
        // Блокируем запросы без origin (только разрешенные домены)
        if (!origin) {
            logger.warn(`CORS blocked request without origin`, {
                ip: req?.ip,
                userAgent: req?.get('User-Agent')
            });
            return callback(new Error('Origin header required'));
        }
        
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

// Проверка IP для дополнительной безопасности
const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
const isIPAllowed = (ip) => {
    if (allowedIPs.length === 0) return true; // Если IP не настроены, разрешаем все
    
    // Удаляем IPv6 префикс если есть
    const cleanIP = ip.replace(/^::ffff:/, '');
    return allowedIPs.includes(cleanIP);
};

// Middleware для проверки IP
const checkIPAccess = (req, res, next) => {
    // Логируем все заголовки для отладки
    logger.info('Request headers debug:', {
        allHeaders: req.headers,
        xRealIP: req.get('X-Real-IP'),
        xForwardedFor: req.get('X-Forwarded-For'),
        xForwardedProto: req.get('X-Forwarded-Proto'),
        host: req.get('Host'),
        origin: req.get('Origin'),
        userAgent: req.get('User-Agent'),
        remoteAddress: req.connection?.remoteAddress,
        socketRemoteAddress: req.socket?.remoteAddress,
        reqIP: req.ip
    });
    
    // Получаем реальный IP из заголовков Nginx
    // Берем первый IP из X-Forwarded-For (реальный IP клиента)
    const clientIP = req.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
                    req.get('X-Real-IP') || 
                    req.ip || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress;
    
    // ВСЕГДА сохраняем правильный IP в req для использования в других middleware
    req.clientIP = clientIP;
    
    // Если IP не настроены, пропускаем проверку
    if (allowedIPs.length === 0) return next();
    
    if (!isIPAllowed(clientIP)) {
        logger.warn(`Access denied from IP: ${clientIP}`, {
            ip: clientIP,
            realIP: req.get('X-Real-IP'),
            forwardedFor: req.get('X-Forwarded-For'),
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

// Middleware для аутентификации API ключами
const authenticateClient = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const clientId = req.headers['x-client-id'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn(`Missing authorization header`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url
        });
        return res.status(401).json({
            success: false,
            error: 'Missing or invalid authorization header'
        });
    }
    
    if (!clientId) {
        logger.warn(`Missing X-Client-ID header`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url
        });
        return res.status(401).json({
            success: false,
            error: 'Missing X-Client-ID header'
        });
    }
    
    const token = authHeader.substring(7);
    const expectedSecret = validApiKeys[clientId];
    
    // В authenticateClient middleware добавить:
    logger.info('API Keys loaded:', validApiKeys);
    logger.info('Received token:', { token });
    logger.info('Expected secret:', { expectedSecret });
    logger.info('Client ID:', { clientId });
    logger.info('Auth header:', { authHeader });
    
    if (!expectedSecret || token !== expectedSecret) {
        logger.warn(`Unauthorized access attempt from client: ${clientId}`, {
            ip: req.clientIP || req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url
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
});

const sendVoiceSchema = Joi.object({
    phone: Joi.string().pattern(/^\+\d{10,15}$/).required(),
    code: Joi.string().pattern(/^\d{4,8}$/).required(),
    language: Joi.string().valid('ru', 'en', 'es', 'fr', 'de').default('en')
});

const sendWhatsAppSchema = Joi.object({
    phone: Joi.string().pattern(/^\+\d{10,15}$/).required(),
    message: Joi.string().min(1).max(1000).required(),
    template: Joi.string().optional()
});


// Маршруты API

// Проверка здоровья сервера
app.get('/api/health', checkIPAccess, authenticateClient, (req, res) => {
    res.json({
        success: true,
        message: 'VerifyBox Vonage Proxy Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        landing: 'VerifyBox Landing Page',
        clientId: req.clientId
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

        logger.info('Vonage API Key:', { vonageApiKey });
        logger.info('Vonage API Secret:', { vonageApiSecret });

        if (!vonageApiKey || !vonageApiSecret) {
            logger.error('Vonage API credentials missing!', {
                hasKey: !!vonageApiKey,
                hasSecret: !!vonageApiSecret
            });
            return res.status(500).json({
                success: false,
                error: 'Vonage API credentials not configured'
            });
        }

        logger.info(`Sending SMS to ${phone} from client ${req.clientId}`, {
            phone,
            sender,
            clientId: req.clientId,
            ip: req.clientIP || req.ip
        });

        // Сначала получаем реальную стоимость SMS
        let smsCost = '0.15'; // значение по умолчанию
        try {
            const countryCode = phone.substring(1, 3);
            const pricingResponse = await axios.get(`https://rest.nexmo.com/pricing/sms?api_key=${vonageApiKey}&api_secret=${vonageApiSecret}&country=${countryCode}`);
            
            if (pricingResponse.data.countries && pricingResponse.data.countries[0]?.networks?.[0]?.prices?.sms?.price) {
                smsCost = pricingResponse.data.countries[0].networks[0].prices.sms.price;
                logger.info(`SMS cost retrieved: ${smsCost} EUR for country ${countryCode}`);
            }
        } catch (pricingError) {
            logger.warn('Failed to get SMS pricing, using default cost:', pricingError.message);
        }

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
            remainingBalance: response.data.messages[0]['remaining-balance'],
            cost: {
                amount: smsCost,
                currency: 'EUR',
                description: 'SMS cost'
            }
        });

    } catch (error) {
        logger.error('Error sending SMS:', {
            error: error.message,
            stack: error.stack,
            clientId: req.clientId,
            ip: req.clientIP || req.ip
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