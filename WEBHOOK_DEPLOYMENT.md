# Webhook Деплой на сервер

Этот документ описывает настройку автоматического деплоя через GitHub webhook.

## 🚀 Преимущества Webhook

- ✅ **Простота настройки** - не нужны SSH ключи
- ✅ **Быстрый деплой** - мгновенная реакция на push
- ✅ **Безопасность** - проверка подписи GitHub
- ✅ **Логирование** - полная история деплоев
- ✅ **Надежность** - работает даже при проблемах с SSH

## 🔧 Настройка

### 1. Установка зависимостей

```bash
# На сервере:
cd /var/www/verifyboxlending
npm install --save express winston
```

### 2. Создание директории для логов

```bash
# На сервере:
mkdir -p logs
chmod 755 logs
```

### 3. Настройка переменных окружения

Добавьте в `.env` файл:

```bash
# Webhook настройки
WEBHOOK_SECRET=your-super-secret-key-here
WEBHOOK_PORT=3002
```

### 4. Запуск webhook сервера

```bash
# На сервере:
cd /var/www/verifyboxlending
node webhook-server.js
```

### 5. Настройка PM2 для webhook

```bash
# На сервере:
pm2 start webhook-server.js --name webhook-server
pm2 save
pm2 startup
```

### 6. Настройка Nginx

Добавьте в конфигурацию Nginx:

```nginx
# В /etc/nginx/sites-available/verifybox
location /webhook/ {
    proxy_pass http://localhost:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Перезагрузите Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🔗 Настройка GitHub Webhook

### 1. Перейдите в настройки репозитория

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Webhooks**
3. Нажмите **Add webhook**

### 2. Настройте webhook

| Поле | Значение |
|------|----------|
| **Payload URL** | `https://verifybox.tech/webhook/github` |
| **Content type** | `application/json` |
| **Secret** | `your-super-secret-key-here` (тот же что в .env) |
| **Events** | Выберите "Just the push event" |
| **Active** | ✅ Включено |

### 3. Сохраните webhook

Нажмите **Add webhook** и проверьте, что статус зеленый.

## 🧪 Тестирование

### 1. Проверка webhook сервера

```bash
# Проверить статус
curl https://verifybox.tech/webhook/health

# Ожидаемый ответ:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### 2. Тестовый push

```bash
# Сделайте небольшое изменение в коде
echo "// Test comment" >> proxy/server.cjs

# Коммит и push
git add .
git commit -m "test: webhook deployment"
git push origin main
```

### 3. Проверка логов

```bash
# На сервере:
pm2 logs webhook-server
pm2 logs proxy
```

## 📋 Процесс деплоя

### Автоматический (через webhook)

1. **Push в main** → GitHub отправляет webhook
2. **Webhook сервер** получает запрос
3. **Проверка подписи** → безопасность
4. **Git pull** → получение изменений
5. **npm install** → обновление зависимостей
6. **pm2 restart** → перезапуск приложения
7. **Логирование** → запись результата

### Ручной (на сервере)

```bash
# На сервере:
cd /var/www/verifyboxlending
git pull origin main
cd proxy
npm install --production
pm2 restart proxy
```

## 🔍 Мониторинг

### Логи webhook сервера

```bash
# Посмотреть логи
pm2 logs webhook-server

# Посмотреть логи файла
tail -f logs/webhook.log
```

### Статус PM2

```bash
# Проверить статус
pm2 status

# Посмотреть логи proxy
pm2 logs proxy
```

### GitHub Webhook

1. Перейдите в **Settings** → **Webhooks**
2. Нажмите на ваш webhook
3. Смотрите **Recent Deliveries**

## 🚨 Устранение проблем

### Webhook не срабатывает

```bash
# Проверить статус webhook сервера
pm2 status webhook-server

# Проверить логи
pm2 logs webhook-server --lines 20

# Перезапустить webhook сервер
pm2 restart webhook-server
```

### Ошибка проверки подписи

```bash
# Проверить WEBHOOK_SECRET в .env
cat .env | grep WEBHOOK_SECRET

# Убедиться, что секрет одинаковый в GitHub и на сервере
```

### Ошибка деплоя

```bash
# Проверить права доступа
ls -la /var/www/verifyboxlending

# Проверить Git статус
cd /var/www/verifyboxlending
git status

# Проверить PM2 статус
pm2 status
```

## 🔒 Безопасность

### Проверка подписи

Webhook проверяет подпись GitHub для предотвращения подделки запросов.

### Ограничение доступа

```bash
# Ограничить доступ к webhook endpoint
# В Nginx можно добавить IP whitelist
location /webhook/ {
    allow 192.168.1.0/24;
    deny all;
    # ... остальная конфигурация
}
```

### Логирование

Все действия логируются для аудита:

- Получение webhook
- Проверка подписи
- Выполнение деплоя
- Результат деплоя

## 📊 Статус деплоя

### Успешный деплой

```
✅ Deployment completed successfully!
PM2 Status: online
Git: up to date
```

### Неудачный деплой

```
❌ Deployment failed!
Error: [описание ошибки]
PM2 Status: errored
```

## 🔄 Откат изменений

Если деплой прошел неудачно:

```bash
# На сервере откатить к предыдущему коммиту
cd /var/www/verifyboxlending
git reset --hard HEAD~1
pm2 restart proxy
```

## 📈 Мониторинг производительности

### Метрики webhook

- Время ответа webhook
- Количество успешных/неудачных деплоев
- Время выполнения деплоя

### Алерты

Можно настроить уведомления при ошибках деплоя:

```bash
# Добавить в webhook-server.js
const sendAlert = (message) => {
    // Отправка уведомления (email, Slack, etc.)
};
```

---

**Готово!** Теперь при каждом пуше в `main` автоматически деплоится через webhook! 🎉
