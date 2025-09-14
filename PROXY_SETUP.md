# Настройка прокси-сервера для Vonage API

Этот проект теперь включает прокси-сервер для работы с Vonage API, который позволяет российскому серверу отправлять SMS на международные номера.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка конфигурации
```bash
# Скопируйте пример конфигурации
cp proxy/env.example proxy/.env

# Отредактируйте файл конфигурации
nano proxy/.env
```

Заполните файл `proxy/.env`:
```bash
PROXY_PORT=3001
VONAGE_API_KEY=ваш_vonage_api_key
VONAGE_API_SECRET=ваш_vonage_api_secret
PROXY_API_KEYS=verifybox-ru:ваш_очень_сильный_секретный_ключ
ALLOWED_CLIENTS=verifybox-ru
LOG_LEVEL=info
ALLOWED_ORIGINS=https://verifybox.ru,https://www.verifybox.ru,https://lk.verifybox.ru
```

### 3. Запуск прокси-сервера

#### Режим разработки:
```bash
npm run proxy:dev
```

#### Продакшн режим с PM2:
```bash
npm run proxy:start
```

### 4. Тестирование
```bash
node test-proxy.cjs
```

## 📁 Структура проекта

```
landing_en/
├── src/                    # React лендинг
├── proxy/                  # Прокси-сервер Vonage
│   ├── server.js          # Основной сервер
│   ├── .env               # Конфигурация (создается из env.example)
│   ├── env.example        # Пример конфигурации
│   └── logs/              # Логи прокси-сервера
├── nginx.conf             # Конфигурация Nginx
├── test-proxy.cjs         # Тестовый скрипт
├── VONAGE_PROXY_README.md # Подробная документация
└── package.json           # Зависимости (включая прокси)
```

## 🔧 Управление сервисами

### Прокси-сервер
```bash
# Запуск
npm run proxy:start

# Остановка
npm run proxy:stop

# Перезапуск
npm run proxy:restart

# Просмотр логов
npm run proxy:logs
```

## 🌐 API Endpoints

После запуска прокси-сервера доступны следующие endpoints:

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Отправка SMS
```bash
curl -X POST http://localhost:3001/api/vonage/send-sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ваш_секретный_ключ" \
  -H "X-Client-ID: verifybox-ru" \
  -d '{
    "phone": "+1234567890",
    "message": "Your verification code: 123456",
    "sender": "VerifyBox",
    "vonageApiKey": "ваш_vonage_api_key",
    "vonageApiSecret": "ваш_vonage_api_secret"
  }'
```

### Проверка баланса
```bash
curl -H "Authorization: Bearer ваш_секретный_ключ" \
     -H "X-Client-ID: verifybox-ru" \
     "http://localhost:3001/api/vonage/balance?vonageApiKey=ваш_vonage_api_key&vonageApiSecret=ваш_vonage_api_secret"
```

## 🔒 Безопасность

- ✅ **CORS защита** - разрешены только домены VerifyBox
- ✅ **API ключи** - аутентификация клиентов
- ✅ **IP фильтрация** - дополнительная защита по IP (опционально)
- ✅ **Логирование** - полное логирование всех запросов

## 📊 Мониторинг

### Логи прокси-сервера
```bash
# PM2 логи
npm run proxy:logs

# Файловые логи
tail -f proxy/logs/proxy-server.log
```

## 🔄 Интеграция с основным сервером

После настройки прокси-сервера обновите переменные окружения в основном проекте VerifyBox:

```bash
# В файле .env основного проекта
VONAGE_PROXY_URL=http://localhost:3001
VONAGE_PROXY_API_KEY=ваш_очень_сильный_секретный_ключ
VONAGE_API_KEY=ваш_vonage_api_key
VONAGE_API_SECRET=ваш_vonage_api_secret
VONAGE_SENDER=VerifyBox
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `npm run proxy:logs`
2. Убедитесь в правильности конфигурации в `proxy/.env`
3. Проверьте статус Vonage API
4. Обратитесь к подробной документации в `VONAGE_PROXY_README.md`

---

**Готово!** Теперь ваш лендинг работает как прокси для Vonage API, позволяя российскому серверу отправлять SMS на международные номера.
