# ⚡️ Rate Limiting - Catalog API

## 📊 Overview

A Catalog API implementa **rate limiting** robusto usando `express-rate-limit` para proteger contra:

- 🚫 Ataques de negação de serviço (DoS)
- 🔐 Tentativas de brute-force em autenticação
- 📈 Uso excessivo de recursos da API
- ⚡ Sobrecarga de operações de escrita

---

## 🔧 Configuração

### Limiters Implementados

#### 1. **Global Limiter**
- **Limite**: 100 requisições por 15 minutos por IP
- **Aplicação**: Todas as rotas
- **Propósito**: Proteção geral contra uso excessivo

```typescript
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

#### 2. **Auth Limiter**
- **Limite**: 5 tentativas falhadas por 15 minutos por IP
- **Aplicação**: `/api/auth/*`
- **Propósito**: Proteção contra brute-force em login/registro
- **Comportamento**: Conta apenas requisições falhadas (`skipSuccessfulRequests: true`)

```typescript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes.',
});
```

#### 3. **API Limiter**
- **Limite**: 50 requisições por 15 minutos por IP
- **Aplicação**: `/api/products/*`
- **Propósito**: Controlar uso da API de produtos

```typescript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many API requests from this IP, please try again later.',
});
```

#### 4. **Write Operations Limiter**
- **Limite**: 20 operações de escrita por 15 minutos por IP
- **Aplicação**: `POST`, `PUT`, `PATCH`, `DELETE` em `/api/products/*`
- **Propósito**: Proteger operações de escrita no banco de dados
- **Comportamento**: Ignora requisições `GET` (`skip: (req) => req.method === 'GET'`)

```typescript
const createProductLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === 'GET',
  message: 'Too many write requests, please try again later.',
});
```

---

## 📊 Headers de Resposta

Todas as requisições incluem headers **RFC-compliant** de rate limiting:

```http
RateLimit-Policy: 50;w=900
RateLimit-Limit: 50
RateLimit-Remaining: 49
RateLimit-Reset: 900
```

### Significado dos Headers

| Header | Descrição | Exemplo |
|--------|-------------|----------|
| `RateLimit-Policy` | Política aplicada (limite;janela em segundos) | `50;w=900` |
| `RateLimit-Limit` | Número máximo de requisições permitidas | `50` |
| `RateLimit-Remaining` | Requisições restantes na janela atual | `49` |
| `RateLimit-Reset` | Segundos até o reset do contador | `900` (15min) |

---

## ⚠️ Resposta 429 - Too Many Requests

Quando o limite é excedido, a API retorna:

```http
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 50
RateLimit-Remaining: 0
RateLimit-Reset: 2025-12-07T19:14:48.383Z
Content-Type: application/json

{
  "status": 429,
  "message": "Too many requests, please try again later.",
  "retryAfter": "2025-12-07T19:14:48.383Z"
}
```

---

## 🧪 Testes

### 1. Teste Manual com cURL

```bash
# Fazer 55 requisições (50 OK + 5 bloqueadas)
for i in {1..55}; do 
  echo "Request $i"
  curl -i http://localhost:3000/api/products
done
```

**Resultado Esperado**:
- Requisições 1-50: `200 OK`
- Requisições 51-55: `429 Too Many Requests`

### 2. Teste com Script Bash

```bash
bash tests/test-rate-limit.sh
```

### 3. Teste de Load com k6

```bash
k6 run tests/load-test.js
```

---

## 📊 Resultados de Testes

### Teste com 55 Requisições Sequenciais

```
✅ Requisições 1-50: HTTP 200 OK
❌ Requisições 51-55: HTTP 429 Too Many Requests

📈 Taxa de Sucesso: 90.9% (esperado para teste de limite)
⚡ Tempo Médio de Resposta: 5.2ms
🔒 Bloqueio Efetivo: 100%
```

### Logs do Servidor

```
🔍 [RATE LIMITER] Middleware execução: IP=::1, Path=/api/products
⚡️ [RATE LIMIT] IP: ::1, Count: 50/50, Remaining: 0
🚫 [RATE LIMIT] BLOQUEADO: IP ::1 excedeu limite
```

---

## 🚀 Arquitetura

### Fluxo de Requisição

```
Client Request
      ↓
⚡ Global Limiter (100 req/15min)
      ↓
    Router
      ↓
⚡ Auth Limiter (5 fail/15min) → /api/auth/*
      ↓
⚡ API Limiter (50 req/15min) → /api/products/*
      ↓
⚡ Write Limiter (20 writes/15min) → POST/PUT/DELETE
      ↓
   Controller
```

### Storage

**Ambiente de Desenvolvimento**: Memory Store (built-in)
**Produção (Recomendado)**: Redis com `rate-limit-redis`

---

## 🔧 Configuração para Produção

### Usando Redis (Recomendado)

```typescript
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  store: new RedisStore({
    client: redisClient,
    prefix: 'catalog-api-rl:',
  }),
});
```

### Vantagens do Redis

- ✅ Persistência de contadores entre restarts
- ✅ Compartilhamento entre múltiplas instâncias da API
- ✅ Melhor performance em escala
- ✅ Suporte a clusters e load balancers

---

## 📊 Monitoramento

### Métricas Importantes

1. **Taxa de requisições bloqueadas** (429 responses)
2. **Distribuição de requisições por IP**
3. **Tempo médio até reset**
4. **Padrões de abuso**

### Logs

```bash
# Ver requisições bloqueadas
grep "429" logs/api.log

# Analisar IPs mais ativos
awk '{print $1}' logs/api.log | sort | uniq -c | sort -rn | head -10
```

---

## ⚙️ Ajuste Fino

### Quando Aumentar os Limites

- 📈 Crescimento legítimo de tráfego
- 🤝 Parceiros com integrações autônomas
- 🔄 Operações de sincronização

### Quando Diminuir os Limites

- 🚫 Detecção de abuso
- ⚡ Sobrecarga de recursos
- 📊 Picos anormais de tráfego

### Customização por Usuário

```typescript
const userSpecificLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: async (req) => {
    const user = req.user;
    if (user?.role === 'premium') return 200;
    if (user?.role === 'partner') return 500;
    return 50; // default
  },
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

---

## 🛡️ Segurança Adicional

### Combinação com Outras Defesas

1. **Helmet.js**: Headers de segurança HTTP
2. **CORS**: Controle de origem cruzada
3. **JWT**: Autenticação stateless
4. **Input Validation**: Validação com Joi/Zod
5. **Rate Limiting**: Controle de tráfego (implementado)

### Boas Práticas

- ✅ Usar HTTPS em produção
- ✅ Implementar API keys para parceiros
- ✅ Monitorar logs de 429 responses
- ✅ Configurar alertas para picos anormais
- ✅ Documentar limites na API docs

---

## 📚 Referências

- [express-rate-limit Documentation](https://github.com/express-rate-limit/express-rate-limit)
- [RFC 6585 - Additional HTTP Status Codes](https://datatracker.ietf.org/doc/html/rfc6585)
- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [rate-limit-redis](https://github.com/wyattjoh/rate-limit-redis)

---

**Implementado por**: Tercio Alves Parente  
**Data**: 07 de Dezembro de 2025  
**Status**: ✅ Producão Ready
