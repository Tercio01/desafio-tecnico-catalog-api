# 🚀 Deployment Guide

Esta aplicação está **production-ready** e pode ser deployada em diversos ambientes.

---

## ✅ Production-Ready Features

- [x] Structured logging (Winston)
- [x] Circuit breaker (Opossum)
- [x] Database monitoring
- [x] Health checks
- [x] Load testing
- [x] Concurrency testing
- [x] Complete documentation (1,625 lines)
- [x] Disaster recovery plan
- [x] CI/CD pipeline (GitHub Actions)

---

## 🐳 Docker Deployment (Recomendado)

### Build da imagem

Restore Dockerfile

mv Dockerfile.bak Dockerfile
Build

docker build -t catalog-api:latest .
Run

docker run -d
-p 3000:3000
-e MONGODB_URI="mongodb+srv://..."
-e JWT_SECRET="your-secret"
-e JWT_EXPIRES_IN="24h"
-e NODE_ENV="production"
--name catalog-api
catalog-api:latest

text

### Docker Compose

version: '3.8'

services:
api:
build: .
ports:
- "3000:3000"
environment:
- MONGODB_URI=${MONGODB_URI}
- JWT_SECRET=${JWT_SECRET}
- JWT_EXPIRES_IN=24h
- NODE_ENV=production
- PORT=3000
- LOG_LEVEL=info
restart: unless-stopped
healthcheck:
test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
interval: 30s
timeout: 10s
retries: 3
start_period: 40s

text

---

## 🌐 Cloud Platforms

### Railway.app

Instalar Railway CLI

npm i -g @railway/cli
Login

railway login
Link ao projeto

railway link
Deploy

railway up

text

**Variáveis necessárias:**

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/catalog
JWT_SECRET=<64-char-secret>
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

text

---

### Render.com

1. Acesse https://render.com
2. **New** → **Web Service**
3. Connect GitHub repository
4. Configurações:
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev`
   - **Environment:** Node
   - **Plan:** Free

5. **Environment Variables:**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV=production`

---

### Heroku

Login

heroku login
Criar app

heroku create catalog-api-prod
Configurar variáveis

heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set NODE_ENV="production"
Deploy

git push heroku main

text

---

### AWS EC2

Conectar ao servidor

ssh ubuntu@your-server-ip
Instalar Node.js

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
Clone repository

git clone https://github.com/user/catalog-api.git
cd catalog-api
Install dependencies

npm ci --production
Configure .env

nano .env
Install PM2

sudo npm install -g pm2
Start application

pm2 start npm --name "catalog-api" -- run dev
Save PM2 configuration

pm2 save
pm2 startup

text

---

### Vercel / Netlify

⚠️ **Não recomendado** para esta aplicação:
- Vercel/Netlify são otimizados para serverless/static
- Esta API precisa de servidor persistente para:
  - Circuit breaker state
  - Database connections
  - Long-running processes

Use Railway, Render, Heroku, ou AWS EC2 ao invés.

---

## 🔒 Produção: Checklist de Segurança

Antes de ir para produção:

- [ ] Alterar `JWT_SECRET` para valor único e seguro (64+ chars)
- [ ] Configurar variáveis de ambiente (nunca commit .env)
- [ ] Habilitar HTTPS/SSL
- [ ] Configurar CORS_ORIGIN para domínio específico
- [ ] Revisar rate limits (ajustar se necessário)
- [ ] Configurar backup automático do MongoDB Atlas
- [ ] Testar disaster recovery plan
- [ ] Configurar alertas de monitoramento
- [ ] Revisar logs de segurança

---

## 📊 Monitoramento em Produção

### Health Checks

Basic health

curl https://your-domain.com/health
Detailed metrics (requer autenticação)

curl -H "Authorization: Bearer <TOKEN>"
https://your-domain.com/api/metrics/database

text

### Logs

Ver logs (Docker)

docker logs -f catalog-api
Ver logs (PM2)

pm2 logs catalog-api
Ver logs (arquivo)

tail -f logs/all.log

text

### Performance Testing

Load test

npm run test:load
Concurrency test

ADMIN_TOKEN="..." npm run test:concurrency

text

---

## 🔄 Continuous Deployment

### GitHub Actions (Configurado)

O pipeline CI/CD está configurado em `.github/workflows/ci.yml`:

- ✅ Tests automáticos em push
- ✅ Build verification
- ✅ Security audit
- ✅ Docker image build (branch main)
- ✅ Deploy automático (configurar secrets)

**Secrets necessários no GitHub:**
- `MONGODB_URI`
- `JWT_SECRET`

---

## 📈 Scaling

### Horizontal Scaling

Para múltiplas instâncias, use:
- **Load balancer** (Nginx, AWS ALB)
- **Redis** para shared cache/sessions
- **MongoDB replica set** (já configurado no Atlas)

### Vertical Scaling

Recursos recomendados por tráfego:

| Req/s | CPU | RAM | Instâncias |
|-------|-----|-----|------------|
| <100 | 1 core | 512MB | 1 |
| 100-500 | 2 cores | 1GB | 1-2 |
| 500-2k | 4 cores | 2GB | 2-4 |
| 2k+ | 8+ cores | 4GB+ | 4+ |

---

## 🆘 Troubleshooting

### Aplicação não inicia

Verificar logs

docker logs catalog-api
ou

pm2 logs
Verificar variáveis de ambiente

env | grep MONGODB_URI
env | grep JWT_SECRET

text

### Erro de conexão com MongoDB

Testar conexão diretamente

mongosh "mongodb+srv://..."
Verificar IP whitelist no MongoDB Atlas
https://cloud.mongodb.com → Network Access

text

### Performance issues

Verificar recursos

docker stats
ou

pm2 monit
Ver slow queries no MongoDB Atlas
https://cloud.mongodb.com → Performance Advisor

text

---

## 📚 Documentos Relacionados

- [Runbook](./operations/RUNBOOK.md)
- [Disaster Recovery](./operations/DISASTER_RECOVERY.md)
- [API Documentation](http://localhost:3000/api-docs)
- [Architecture](./ARCHITECTURE.md)

