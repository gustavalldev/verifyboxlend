# VerifyBox Landing + Vonage Proxy Server

Этот проект объединяет лендинг VerifyBox с прокси-сервером для работы с Vonage API, размещенный на американском сервере.

## 🏗️ Архитектура

```
Российский сервер (VerifyBox) → Американский сервер (Лендинг + Прокси) → Vonage API
```

## 📁 Структура проекта

```
landing_en/
├── src/                    # React лендинг
├── proxy/                  # Прокси-сервер Vonage
│   ├── server.js          # Основной сервер
│   ├── env.example        # Пример конфигурации
│   └── logs/              # Логи прокси-сервера
├── deploy.sh              # Скрипт развертывания
├── nginx.conf             # Конфигурация Nginx
└── package.json           # Зависимости (включая прокси)
```

## 🚀 Быстрый старт

### 1. Подготовка сервера

```bash
# Установка Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Nginx
sudo apt-get install -y nginx
```

### 2. Развертывание

```bash
# Клонирование проекта (или копирование файлов)
cd /path/to/your/landing

# Запуск скрипта развертывания
chmod +x deploy.sh
./deploy.sh
```

### 3. Настройка конфигурации

```bash
# Настройка переменных окружения прокси
cp proxy/env.example proxy/.env
nano proxy/.env
```

Заполните файл `proxy/.env`:
```bash
PROXY_PORT=3001
VONAGE_API_KEY=ваш_vonage_api_key
VONAGE_API_SECRET=ваш_vonage_api_secret
VONAGE_SENDER=VerifyBox
PROXY_API_KEYS=verifybox-ru:ваш_очень_сильный_секретный_ключ
ALLOWED_CLIENTS=verifybox-ru
LOG_LEVEL=info
ALLOWED_ORIGINS=https://verifybox.ru,https://www.verifybox.ru
```

### 4. Описание переменных окружения

| Переменная | Описание | Обязательная | По умолчанию |
|------------|----------|--------------|--------------|
| `PROXY_PORT` | Порт для прокси-сервера | Нет | `3001` |
| `VONAGE_API_KEY` | API ключ Vonage | Да | - |
| `VONAGE_API_SECRET` | API секрет Vonage | Да | - |
| `VONAGE_SENDER` | Имя отправителя SMS (до 11 символов) | Нет | `VerifyBox` |
| `PROXY_API_KEYS` | API ключи для аутентификации клиентов | Нет | - |
| `ALLOWED_CLIENTS` | Разрешенные клиенты | Нет | - |
| `LOG_LEVEL` | Уровень логирования | Нет | `info` |
| `ALLOWED_ORIGINS` | Разрешенные домены для CORS | Нет | `https://verifybox.ru,https://www.verifybox.ru` |
| `ALLOWED_IPS` | Разрешенные IP-адреса (опционально) | Нет | - |

### 5. Перезапуск сервисов

```bash
# Перезапуск прокси-сервера
sudo systemctl restart verifybox-proxy

# Проверка статуса
sudo systemctl status verifybox-proxy
```

## 🔧 Управление сервисами

### Прокси-сервер

```bash
# Запуск/остановка
sudo systemctl start verifybox-proxy
sudo systemctl stop verifybox-proxy
sudo systemctl restart verifybox-proxy

# Просмотр логов
sudo journalctl -u verifybox-proxy -f

# Проверка статуса
sudo systemctl status verifybox-proxy
```

### Nginx

```bash
# Перезагрузка конфигурации
sudo nginx -t && sudo systemctl reload nginx

# Просмотр логов
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PM2 (альтернативный способ)

```bash
# Если предпочитаете PM2 вместо systemd
npm run proxy:start
npm run proxy:stop
npm run proxy:restart
npm run proxy:logs
```

## 🌐 API Endpoints

После развертывания доступны следующие endpoints:

### Health Check
```bash
curl https://your-domain.com/api/health
```

### Отправка SMS
```bash
curl -X POST https://your-domain.com/api/vonage/send-sms \
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
     "https://your-domain.com/api/vonage/balance?vonageApiKey=ваш_vonage_api_key&vonageApiSecret=ваш_vonage_api_secret"
```

## 🔒 Безопасность

### Основная защита через CORS
Поскольку все запросы проходят через ваш основной сервер, основная защита обеспечивается через **CORS**:

- ✅ **Разрешены только домены VerifyBox** (`verifybox.ru`, `www.verifybox.ru`, `lk.verifybox.ru`)
- ✅ **Блокировка всех сторонних доменов**
- ✅ **Логирование попыток несанкционированного доступа**

### Дополнительные уровни защиты (опционально)

#### 1. **IP-адресная защита**
```bash
# В proxy/.env добавьте IP вашего российского сервера для максимальной безопасности
ALLOWED_IPS=123.456.789.0
```

#### 2. **API ключи аутентификации** (опционально)
```bash
# Если хотите дополнительную защиту через API ключи
PROXY_API_KEYS=verifybox-ru:your_secret_key_here
```


### Рекомендуемая настройка

**Минимальная конфигурация (только CORS):**
```bash
# Достаточно настроить только CORS
ALLOWED_ORIGINS=https://verifybox.ru,https://www.verifybox.ru,https://lk.verifybox.ru
```

**Максимальная безопасность:**
```bash
# Добавьте IP российского сервера
ALLOWED_IPS=ваш_российский_IP

# И API ключи для дополнительной защиты
PROXY_API_KEYS=verifybox-ru:очень_длинный_случайный_ключ
```

## 📊 Мониторинг и логи

### Логи прокси-сервера
```bash
# Systemd логи
sudo journalctl -u verifybox-proxy -f

# Файловые логи
tail -f proxy/logs/proxy-server.log
```

### Логи Nginx
```bash
# Access логи
sudo tail -f /var/log/nginx/access.log

# Error логи
sudo tail -f /var/log/nginx/error.log
```

### Метрики
```bash
# Статус всех сервисов
sudo systemctl status verifybox-proxy nginx

# Использование ресурсов
htop
df -h
```

## 🔧 Настройка основного сервера

После развертывания прокси-сервера обновите переменные окружения в основном проекте VerifyBox:

```bash
# В файле .env основного проекта
VONAGE_PROXY_URL=https://your-domain.com
VONAGE_PROXY_API_KEY=ваш_очень_сильный_секретный_ключ
VONAGE_API_KEY=ваш_vonage_api_key
VONAGE_API_SECRET=ваш_vonage_api_secret
VONAGE_SENDER=VerifyBox
```

## 🛠️ Troubleshooting

### Проблема: Прокси-сервер не запускается
```bash
# Проверьте логи
sudo journalctl -u verifybox-proxy -n 50

# Проверьте конфигурацию
sudo systemctl status verifybox-proxy

# Проверьте порт
sudo netstat -tlnp | grep 3001
```

### Проблема: API не отвечает
```bash
# Проверьте доступность порта
curl http://localhost:3001/api/health

# Проверьте Nginx
sudo nginx -t
sudo systemctl status nginx
```

### Проблема: Ошибки аутентификации
- Проверьте правильность API ключей в `proxy/.env`
- Убедитесь, что ключи совпадают в основном проекте
- Проверьте заголовки запросов

### Проблема: SMS не отправляются
- Проверьте баланс Vonage
- Убедитесь в правильности номера телефона
- Проверьте логи прокси-сервера

## 📈 Масштабирование

### Горизонтальное масштабирование
- Используйте load balancer для нескольких экземпляров прокси
- Настройте sticky sessions если необходимо
- Используйте Redis для кэширования

### Вертикальное масштабирование
- Оптимизируйте настройки Node.js
- Используйте PM2 кластер режим

## 🔄 Обновления

### Обновление кода
```bash
# Остановка сервисов
sudo systemctl stop verifybox-proxy

# Обновление кода
git pull origin main
npm install
npm run build

# Запуск сервисов
sudo systemctl start verifybox-proxy
sudo systemctl reload nginx
```

### Обновление зависимостей
```bash
npm update
npm audit fix
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи всех сервисов
2. Убедитесь в правильности конфигурации
3. Проверьте статус Vonage API
4. Обратитесь к документации Vonage

---

**Готово!** Теперь ваш лендинг работает как прокси для Vonage API, позволяя российскому серверу отправлять SMS на международные номера.
