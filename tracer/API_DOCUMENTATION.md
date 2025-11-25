# 📚 Documentação da API - Tracer

## Base URL

```
http://localhost:6964
```

## Autenticação

Todas as rotas da API (exceto `/health`) requerem autenticação via Bearer Token.

**Header necessário:**
```
Authorization: Bearer {API_KEY}
```

A `API_KEY` deve ser configurada no arquivo `.env` e fornecida no header de cada requisição.

---

## Endpoints

### 1. Health Check

Verifica o status do sistema e a conexão com o banco de dados.

**Endpoint:** `GET /health`

**Autenticação:** Não requerida

**Rate Limit:** 60 requisições por minuto por IP

**Resposta de Sucesso (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "database": {
    "connected": true,
    "status": "ok"
  },
  "environment": "development"
}
```

**Resposta de Erro (503):**
```json
{
  "status": "error",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "database": {
    "connected": false,
    "status": "error",
    "error": "Database connection failed"
  },
  "environment": "development"
}
```

---

### 2. Criar Evento

Cria um novo evento no sistema.

**Endpoint:** `POST /api/events`

**Autenticação:** Requerida

**Rate Limit:** 
- Geral: 100 requisições por 15 minutos por IP
- Específico para criação: 30 requisições por minuto por IP

**Headers:**
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Body:**
```json
{
  "event": "user_login",
  "source": "web-app",
  "metadata": {
    "userId": "123",
    "action": "login",
    "device": "desktop"
  },
  "userId": "user-123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Campos:**
- `event` (obrigatório): Tipo do evento (string, máx. 255 caracteres)
- `source` (opcional): Origem do evento (string, máx. 255 caracteres)
- `metadata` (opcional): Objeto JSON com dados adicionais (máx. 10KB, máx. 10 níveis de profundidade)
- `userId` (opcional): ID do usuário (string, máx. 255 caracteres)
- `timestamp` (opcional): Data/hora do evento em formato ISO 8601 (máx. 365 dias no passado, 1 dia no futuro)

**Nota:** O IP e User-Agent são extraídos automaticamente do header da requisição.

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "eventType": "user_login",
  "source": "web-app",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metadata": {
    "userId": "123",
    "action": "login",
    "device": "desktop"
  },
  "userId": "user-123",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [
    "Field \"event\" is required and must be a non-empty string"
  ]
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```

**Resposta de Erro (429):**
```json
{
  "error": "Too Many Requests",
  "message": "Too many event creation requests, please try again later.",
  "retryAfter": "1 minute"
}
```

---

### 3. Buscar Evento por ID

Retorna um evento específico pelo seu ID.

**Endpoint:** `GET /api/events/:id`

**Autenticação:** Requerida

**Rate Limit:** 100 requisições por 15 minutos por IP

**Parâmetros:**
- `id` (path): ID do evento (número inteiro)

**Exemplo:**
```
GET /api/events/1
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "eventType": "user_login",
  "source": "web-app",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metadata": {
    "userId": "123"
  },
  "userId": "user-123",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "AppError",
  "message": "Event with id 999 not found"
}
```

---

### 4. Listar Eventos

Lista todos os eventos com paginação.

**Endpoint:** `GET /api/events`

**Autenticação:** Requerida

**Rate Limit:** 100 requisições por 15 minutos por IP

**Query Parameters:**
- `limit` (opcional): Número máximo de eventos a retornar (padrão: 100, máx: 1000)
- `offset` (opcional): Número de eventos a pular (padrão: 0)

**Exemplo:**
```
GET /api/events?limit=10&offset=0
```

**Resposta de Sucesso (200):**
```json
{
  "events": [
    {
      "id": 1,
      "eventType": "user_login",
      "source": "web-app",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "metadata": { "userId": "123" },
      "userId": "user-123",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

---

### 5. Buscar Eventos por Tipo

Retorna eventos filtrados por tipo.

**Endpoint:** `GET /api/events/type/:type`

**Autenticação:** Requerida

**Rate Limit:** 100 requisições por 15 minutos por IP

**Parâmetros:**
- `type` (path): Tipo do evento a buscar

**Query Parameters:**
- `limit` (opcional): Número máximo de eventos a retornar (padrão: 100, máx: 1000)

**Exemplo:**
```
GET /api/events/type/user_login?limit=50
```

**Resposta de Sucesso (200):**
```json
{
  "events": [
    {
      "id": 1,
      "eventType": "user_login",
      "source": "web-app",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "metadata": { "userId": "123" },
      "userId": "user-123",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 6. Buscar Eventos por User ID

Retorna eventos filtrados por ID do usuário.

**Endpoint:** `GET /api/events/user/:userId`

**Autenticação:** Requerida

**Rate Limit:** 100 requisições por 15 minutos por IP

**Parâmetros:**
- `userId` (path): ID do usuário

**Query Parameters:**
- `limit` (opcional): Número máximo de eventos a retornar (padrão: 100, máx: 1000)

**Exemplo:**
```
GET /api/events/user/user-123?limit=20
```

**Resposta de Sucesso (200):**
```json
{
  "events": [
    {
      "id": 1,
      "eventType": "user_login",
      "source": "web-app",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "metadata": { "userId": "123" },
      "userId": "user-123",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `404` - Recurso não encontrado
- `429` - Muitas requisições (Rate Limit)
- `500` - Erro interno do servidor
- `503` - Serviço indisponível

---

## Rate Limiting

O sistema implementa rate limiting para prevenir abuso:

- **Rotas gerais:** 100 requisições por 15 minutos por IP
- **Criação de eventos:** 30 requisições por minuto por IP
- **Health check:** 60 requisições por minuto por IP

Quando o limite é excedido, a API retorna status `429` com informações sobre quando tentar novamente.

**Headers de Rate Limit:**
- `RateLimit-Limit`: Limite máximo de requisições
- `RateLimit-Remaining`: Requisições restantes
- `RateLimit-Reset`: Timestamp de quando o limite será resetado

---

## Validações

### Campo `event`
- Obrigatório
- Deve ser uma string não vazia
- Máximo de 255 caracteres

### Campo `source`
- Opcional
- Deve ser uma string
- Máximo de 255 caracteres
- Não pode ser string vazia se fornecido

### Campo `metadata`
- Opcional
- Deve ser um objeto JSON válido
- Máximo de 10KB quando serializado
- Máximo de 10 níveis de profundidade
- Não pode ser um array

### Campo `userId`
- Opcional
- Deve ser uma string
- Máximo de 255 caracteres
- Não pode ser string vazia se fornecido

### Campo `timestamp`
- Opcional
- Deve ser uma string em formato ISO 8601 válido
- Exemplo: `2024-01-15T10:30:00Z`
- Não pode estar mais de 365 dias no passado
- Não pode estar mais de 1 dia no futuro

---

## Exemplos de Uso

### cURL

**Criar evento:**
```bash
curl -X POST http://localhost:6964/api/events \
  -H "Authorization: Bearer sua-api-key-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "user_login",
    "source": "web-app",
    "metadata": {
      "userId": "123"
    },
    "userId": "user-123"
  }'
```

**Listar eventos:**
```bash
curl -X GET "http://localhost:6964/api/events?limit=10&offset=0" \
  -H "Authorization: Bearer sua-api-key-aqui"
```

**Buscar evento por ID:**
```bash
curl -X GET http://localhost:6964/api/events/1 \
  -H "Authorization: Bearer sua-api-key-aqui"
```

### JavaScript (Fetch)

```javascript
const API_KEY = 'sua-api-key-aqui';
const BASE_URL = 'http://localhost:6964';

// Criar evento
const createEvent = async () => {
  const response = await fetch(`${BASE_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: 'user_login',
      source: 'web-app',
      metadata: {
        userId: '123'
      },
      userId: 'user-123'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Listar eventos
const listEvents = async () => {
  const response = await fetch(`${BASE_URL}/api/events?limit=10`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  
  const data = await response.json();
  console.log(data);
};
```

---

## Tratamento de Erros

Todos os erros retornam um objeto JSON com a seguinte estrutura:

```json
{
  "error": "ErrorType",
  "message": "Descrição do erro"
}
```

Para erros de validação, também é incluído um campo `details`:

```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [
    "Field \"event\" is required",
    "Field \"timestamp\" must be a valid ISO 8601 date string"
  ]
}
```

---

## Logs

O sistema utiliza logging estruturado com Pino. Todos os logs incluem:
- Timestamp
- Nível de log (info, warn, error, debug)
- Informações da requisição (método, URL, IP)
- Detalhes de erros quando aplicável

Em ambiente de desenvolvimento, os logs são formatados de forma legível. Em produção, são retornados em formato JSON.

---

## Suporte

Para questões ou problemas, consulte:
- Repositório: https://github.com/freit4sdev/ds
- Issues: https://github.com/freit4sdev/ds/issues

