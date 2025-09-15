# Vonage Verify API - Документация

Этот документ описывает использование Vonage Verify API для отправки OTP кодов через SMS и Voice.

## 🚀 Преимущества Vonage Verify API

- ✅ **Автоматическая генерация кодов** - Vonage генерирует коды сам
- ✅ **Встроенная защита от спама** - ограничения на количество попыток
- ✅ **Автоматические повторные попытки** - если код не доставлен
- ✅ **Поддержка SMS + Voice** - без необходимости аренды номеров
- ✅ **Международная поддержка** - работает во всех странах
- ✅ **Встроенное логирование** - все действия в Vonage Dashboard

## 📋 Доступные Endpoints

### 1. Отправка OTP через SMS
**POST** `/api/vonage/verify-sms`

Отправляет SMS с кодом верификации.

#### Параметры запроса:
```json
{
  "phone": "+1234567890",
  "brand": "VerifyBox",
  "codeLength": 6,
  "language": "ru"
}
```

#### Параметры:
| Параметр | Тип | Обязательный | Описание | По умолчанию |
|----------|-----|--------------|----------|--------------|
| `phone` | string | ✅ | Номер телефона в формате E.164 | - |
| `brand` | string | ❌ | Название бренда в SMS | `VerifyBox` |
| `codeLength` | number | ❌ | Длина кода (4-10) | `6` |
| `language` | string | ❌ | Язык (ru/en/es/fr/de) | `ru` |

#### Пример запроса:
```bash
curl -X POST https://verifybox.tech/api/vonage/verify-sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ваш_ключ" \
  -H "X-Client-ID: verifybox-ru" \
  -H "Origin: https://lk.verifybox.ru" \
  -d '{
    "phone": "+1234567890",
    "brand": "VerifyBox",
    "codeLength": 6,
    "language": "ru"
  }'
```

#### Пример ответа:
```json
{
  "success": true,
  "message": "SMS verification code sent successfully",
  "requestId": "abc123def456",
  "status": "0"
}
```

### 2. Отправка OTP через Voice
**POST** `/api/vonage/verify-voice`

Отправляет голосовой звонок с диктовкой кода.

#### Параметры запроса:
```json
{
  "phone": "+1234567890",
  "brand": "VerifyBox",
  "codeLength": 6,
  "language": "ru"
}
```

#### Параметры:
| Параметр | Тип | Обязательный | Описание | По умолчанию |
|----------|-----|--------------|----------|--------------|
| `phone` | string | ✅ | Номер телефона в формате E.164 | - |
| `brand` | string | ❌ | Название бренда в звонке | `VerifyBox` |
| `codeLength` | number | ❌ | Длина кода (4-10) | `6` |
| `language` | string | ❌ | Язык (ru/en/es/fr/de) | `ru` |

#### Пример запроса:
```bash
curl -X POST https://verifybox.tech/api/vonage/verify-voice \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ваш_ключ" \
  -H "X-Client-ID: verifybox-ru" \
  -H "Origin: https://lk.verifybox.ru" \
  -d '{
    "phone": "+1234567890",
    "brand": "VerifyBox",
    "codeLength": 6,
    "language": "ru"
  }'
```

#### Пример ответа:
```json
{
  "success": true,
  "message": "Voice verification code sent successfully",
  "requestId": "abc123def456",
  "status": "0"
}
```

### 3. Проверка кода верификации
**POST** `/api/vonage/check-verify`

Проверяет введенный пользователем код.

#### Параметры запроса:
```json
{
  "requestId": "abc123def456",
  "code": "123456"
}
```

#### Параметры:
| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `requestId` | string | ✅ | ID запроса из предыдущего ответа |
| `code` | string | ✅ | Код, введенный пользователем |

#### Пример запроса:
```bash
curl -X POST https://verifybox.tech/api/vonage/check-verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ваш_ключ" \
  -H "X-Client-ID: verifybox-ru" \
  -H "Origin: https://lk.verifybox.ru" \
  -d '{
    "requestId": "abc123def456",
    "code": "123456"
  }'
```

#### Пример ответа (успех):
```json
{
  "success": true,
  "message": "Verification successful",
  "status": "0",
  "requestId": "abc123def456"
}
```

#### Пример ответа (ошибка):
```json
{
  "success": false,
  "message": "Verification failed",
  "status": "15",
  "requestId": "abc123def456",
  "errorText": "The code provided does not match the expected value"
}
```

## 🔧 Коды статусов

| Код | Описание |
|-----|----------|
| `0` | Успешно |
| `1` | Throttled (слишком много запросов) |
| `2` | Missing параметры |
| `3` | Invalid параметры |
| `4` | Invalid credentials |
| `5` | Internal error |
| `6` | Blacklisted number |
| `7` | Account barred |
| `8` | Quota exceeded |
| `9` | Concurrent verifications |
| `10` | Unsupported network |
| `15` | Invalid code |
| `16` | Invalid code (too many attempts) |
| `17` | Invalid code (expired) |

## 🔒 Безопасность

### Аутентификация
Все запросы требуют:
- `Authorization: Bearer ваш_ключ`
- `X-Client-ID: verifybox-ru`
- `Origin: https://lk.verifybox.ru`

### Ограничения
- **Время жизни кода**: 5 минут
- **Максимум попыток**: 3 попытки ввода кода
- **Повторная отправка**: не ранее чем через 1 минуту
- **Защита от спама**: автоматические ограничения

## 📱 Поддерживаемые языки

| Код | Язык |
|-----|------|
| `ru` | Русский |
| `en` | English |
| `es` | Español |
| `fr` | Français |
| `de` | Deutsch |

## 🌍 Поддерживаемые страны

Vonage Verify API работает во всех странах без необходимости аренды номеров.

## 💡 Примеры использования

### JavaScript (Node.js)
```javascript
const axios = require('axios');

// Отправка SMS с кодом
async function sendSmsVerification(phone) {
  try {
    const response = await axios.post('https://verifybox.tech/api/vonage/verify-sms', {
      phone: phone,
      brand: 'VerifyBox',
      codeLength: 6,
      language: 'ru'
    }, {
      headers: {
        'Authorization': 'Bearer ваш_ключ',
        'X-Client-ID': 'verifybox-ru',
        'Origin': 'https://lk.verifybox.ru'
      }
    });
    
    return response.data.requestId;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Проверка кода
async function checkVerificationCode(requestId, code) {
  try {
    const response = await axios.post('https://verifybox.tech/api/vonage/check-verify', {
      requestId: requestId,
      code: code
    }, {
      headers: {
        'Authorization': 'Bearer ваш_ключ',
        'X-Client-ID': 'verifybox-ru',
        'Origin': 'https://lk.verifybox.ru'
      }
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}
```

### PHP
```php
<?php
function sendSmsVerification($phone) {
    $url = 'https://verifybox.tech/api/vonage/verify-sms';
    
    $data = [
        'phone' => $phone,
        'brand' => 'VerifyBox',
        'codeLength' => 6,
        'language' => 'ru'
    ];
    
    $headers = [
        'Authorization: Bearer ваш_ключ',
        'X-Client-ID: verifybox-ru',
        'Origin: https://lk.verifybox.ru',
        'Content-Type: application/json'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $result = json_decode($response, true);
        return $result['requestId'];
    } else {
        throw new Exception('SMS verification failed: ' . $response);
    }
}

function checkVerificationCode($requestId, $code) {
    $url = 'https://verifybox.tech/api/vonage/check-verify';
    
    $data = [
        'requestId' => $requestId,
        'code' => $code
    ];
    
    $headers = [
        'Authorization: Bearer ваш_ключ',
        'X-Client-ID: verifybox-ru',
        'Origin: https://lk.verifybox.ru',
        'Content-Type: application/json'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $result = json_decode($response, true);
        return $result['success'];
    } else {
        throw new Exception('Verification check failed: ' . $response);
    }
}
?>
```

## 🚨 Обработка ошибок

### Частые ошибки и решения:

1. **Статус 1 (Throttled)**
   - **Причина**: Слишком много запросов
   - **Решение**: Подождать 1 минуту перед повторной отправкой

2. **Статус 6 (Blacklisted number)**
   - **Причина**: Номер в черном списке
   - **Решение**: Использовать другой номер

3. **Статус 15 (Invalid code)**
   - **Причина**: Неправильный код
   - **Решение**: Попросить пользователя ввести код заново

4. **Статус 17 (Expired)**
   - **Причина**: Код истек (5 минут)
   - **Решение**: Запросить новый код

## 📊 Мониторинг

Все запросы логируются в:
- **Прокси-сервер**: `proxy/logs/proxy-server.log`
- **Vonage Dashboard**: [dashboard.nexmo.com](https://dashboard.nexmo.com/)

## 🔄 Обновления

Для обновления API:
```bash
pm2 restart proxy
```

---

**Готово!** Теперь у вас есть полнофункциональный Vonage Verify API для отправки OTP кодов через SMS и Voice! 🎉
