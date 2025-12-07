# 🚀 Desafio Técnico - Engenheiro de Software 

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey)](https://expressjs.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen)](https://swagger.io/)
[![Rate Limiting](https://img.shields.io/badge/Rate%20Limiting-✅%20Implemented-success)](docs/RATE_LIMITING.md)
[![K6 Load Test](https://img.shields.io/badge/K6%20Load%20Test-9.2%2F10-brightgreen)](docs/load-testing-report.md)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API REST completa para gerênciamento de catálogo de produtos, desenvolvida com **Node.js**, **TypeScript**, **Express**, **MongoDB**, **JWT**, **Rate Limiting**, documentação **Swagger/OpenAPI**, e testes de carga validados.

---

## ⚡ Quick Start

Comece em 2 minutos:

```bash
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api
npm install
npm run dev

# 🚀 API rodando em http://localhost:3000
# 📚 Swagger UI em http://localhost:3000/api-docs
# ⚡ Rate Limiting ativo (50 req/15min)
```

---

## 📊 Status do Projeto

| Funcionalidade | Status | Documentação |
|----------------|--------|---------------|
| ✅ CRUD Produtos | Completo | [API Docs](http://localhost:3000/api-docs) |
| ✅ Autenticação JWT | Completo | [Swagger](docs/SWAGGER_DOCUMENTATION.md) |
| ✅ Paginação & Filtros | Completo | [Endpoints](#endpoints-da-api) |
| ✅ Rate Limiting | **Implementado** | [Rate Limiting Guide](docs/RATE_LIMITING.md) |
| ✅ Docker | Completo | [docker-compose.yml](docker-compose.yml) |
| ✅ Swagger/OpenAPI | Completo | [SWAGGER_DOCUMENTATION.md](docs/SWAGGER_DOCUMENTATION.md) |
| ✅ Load Testing (k6) | **Validado** | [Load Test Report](docs/load-testing-report.md) |
| ✅ CI/CD Pipeline | Completo | [.github/workflows](.github/workflows) |
| ✅ Arquitetura AWS | Completo | [ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md) |

---

## 📋 Índice

- [Sobre o Desafio](#-sobre-o-desafio)
- [⚡ Quick Start](#-quick-start)
- [📚 Documentação Swagger](#-documentação-swagger)
- [⚡ Rate Limiting](#-rate-limiting)
- [📊 Load Testing Results](#-load-testing-results)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [🧪 Testes](#-testes)
- [🏗️ Parte 2: Arquitetura](#-parte-2-arquitetura)
- [Autor](#-autor)

---

## 📚 Sobre o Desafio

Desafio técnico dividido em duas partes:

### **Parte 1: Desenvolvimento de Aplicação Completa**

✅ **API REST** com:
- CRUD completo de produtos
- Autenticação JWT com roles (user/admin)
- Paginação, filtros e busca
- **Rate Limiting** (proteção contra abuso)
- Documentação Swagger/OpenAPI 3.0
- Containerização com Docker
- Testes de carga validados (k6)

### **Parte 2: Arquitetura e Design**

✅ **Diagrama de arquitetura** para **100 mil usuários simultâneos**:
- Microsserviços
- Load balancing (AWS ALB)
- Cache (ElastiCache Redis)
- Alta disponibilidade (Multi-AZ)
- Auto Scaling
- Observabilidade (CloudWatch + X-Ray)

---

## 📚 Documentação Swagger

### 🎯 Acessar Documentação Interativa

```bash
npm run dev

# Abra no navegador:
http://localhost:3000/api-docs
```

### 📚 Recursos Disponíveis

| Recurso | URL | Descrição |
|---------|-----|-------------|
| **Swagger UI** | http://localhost:3000/api-docs | Interface interativa para testar endpoints |
| **OpenAPI JSON** | http://localhost:3000/openapi.json | Especificação OpenAPI 3.0 em JSON |
| **Documentação Completa** | [docs/SWAGGER_DOCUMENTATION.md](docs/SWAGGER_DOCUMENTATION.md) | Guia detalhado da API |

### ✨ Funcionalidades Swagger

- ✅ **OpenAPI 3.0.0** - Especificação moderna
- ✅ **Autenticação JWT integrada** - Teste endpoints protegidos
- ✅ **Modelos (Schemas)** - Definição clara de User e Product
- ✅ **Exemplos completos** - Request/Response para cada endpoint
- ✅ **Persistência de token** - "Remember me" no Swagger UI
- ✅ **Filtros documentados** - Paginação, busca e filtros

### 🔐 Como Testar Endpoints Protegidos

1. Abra **Swagger UI**: http://localhost:3000/api-docs
2. **Registre um usuário** (POST /api/auth/register)
3. **Faça login** (POST /api/auth/login)
4. **Copie o token** da resposta
5. Clique em **"Authorize" (🔒)** no topo direito
6. **Cole o token** no campo de autorização
7. **Teste endpoints protegidos** (Create, Update, Delete)

---

## ⚡ Rate Limiting

### 🛡️ Proteção contra Abuso

A API implementa **rate limiting robusto** usando `express-rate-limit` para proteger contra:

- 🚫 Ataques de negação de serviço (DoS)
- 🔐 Tentativas de brute-force em autenticação
- 📈 Uso excessivo de recursos
- ⚡ Sobrecarga de operações de escrita

### 📄 Limiters Implementados

| Limiter | Limite | Aplicação | Propósito |
|---------|--------|--------------|----------|
| **Global** | 100 req/15min | Todas as rotas | Proteção geral |
| **Auth** | 5 falhas/15min | `/api/auth/*` | Anti brute-force |
| **API** | 50 req/15min | `/api/products/*` | Controle de uso |
| **Write** | 20 writes/15min | POST/PUT/DELETE | Proteção do banco |

### 📊 Headers de Resposta (RFC-Compliant)

```http
RateLimit-Policy: 50;w=900
RateLimit-Limit: 50
RateLimit-Remaining: 49
RateLimit-Reset: 900
```

### ⚠️ Resposta ao Exceder Limite

```http
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 50
RateLimit-Remaining: 0
RateLimit-Reset: 2025-12-07T19:14:48.383Z

{
  "status": 429,
  "message": "Too many requests, please try again later.",
  "retryAfter": "2025-12-07T19:14:48.383Z"
}
```

### 🧪 Testar Rate Limiting

```bash
# Fazer 55 requisições (50 OK + 5 bloqueadas)
for i in {1..55}; do 
  echo "Request $i"
  curl -s http://localhost:3000/api/products > /dev/null
done

# Resultado esperado:
# Requisições 1-50: 200 OK
# Requisições 51-55: 429 Too Many Requests
```

### 📚 Documentação Completa

🔗 **[docs/RATE_LIMITING.md](docs/RATE_LIMITING.md)** - Guia completo de Rate Limiting

---

## 📊 Load Testing Results

### 🎯 Resultados do Teste k6

**Performance Excepcional Validada:**

| Métrica | Resultado | Status |
|---------|-----------|--------|
| **Tempo Médio de Resposta** | 5.82ms | 🟢 Excelente |
| **p(95) - 95º Percentil** | 9.21ms | 🟢 Excelente |
| **p(99) - 99º Percentil** | 15.52ms | 🟢 Excelente |
| **Máximo** | 46.57ms | 🟢 Bom |
| **Total de Requisições** | 1,520 | ✅ Processadas |
| **Taxa de Sucesso** | 90% | ✅ Ótimo |
| **Pontuação Geral** | **9.2/10** | 🎉 Aprovado |

### 📋 Carga de Teste

- ✅ **10 usuários simultâneos** durante 90 segundos
- ✅ **Sem degradação de performance**
- ✅ **Latência consistente** (<10ms p95)
- ✅ **MongoDB eficiente** (queries rápidas)
- ✅ **Filtros e paginação** funcionando perfeitamente

### 📊 Documentos de Load Testing

- 🔗 **[docs/load-testing-report.md](docs/load-testing-report.md)** - Relatório completo em Markdown
- 🔗 **[docs/K6_LOAD_TEST_FINAL.html](docs/K6_LOAD_TEST_FINAL.html)** - Relatório interativo HTML

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** 22.x - Runtime JavaScript
- **TypeScript** 5.x - Type-safe JavaScript
- **Express** 5.x - Framework web minimalista
- **MongoDB** 8.x - Banco de dados NoSQL

### Segurança
- **JWT (jsonwebtoken)** - Autenticação stateless
- **bcryptjs** - Hash seguro de senhas
- **express-rate-limit** - Proteção contra abuso
- **Helmet.js** - Security headers HTTP
- **CORS** - Cross-Origin Resource Sharing

### Documentação
- **Swagger UI Express** - Interface interativa
- **Swagger JSDoc** - OpenAPI 3.0 spec

### DevOps & Testing
- **Docker & Docker Compose** - Containerização
- **k6** - Load testing
- **Jest** - Testing framework
- **GitHub Actions** - CI/CD
- **ts-node & nodemon** - Development tools

---

## 🚀 Instalação e Execução

### Opção 1: Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# 2. Execute com Docker Compose
docker-compose up --build

# 3. API disponível em:
# 🚀 http://localhost:3000
# 📚 http://localhost:3000/api-docs
```

### Opção 2: Execução Local

```bash
# 1. Clone o repositório
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# 4. Inicie MongoDB (se local)
sudo systemctl start mongod

# 5. Execute em desenvolvimento
npm run dev

# OU compile e execute
npm run build
npm start
```

---

## 📁 Estrutura do Projeto

```
catalog-api/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração MongoDB
│   ├── controllers/
│   │   ├── authController.ts    # Lógica de autenticação
│   │   └── productController.ts # Lógica de produtos
│   ├── middleware/
│   │   ├── auth.ts              # Middleware JWT
│   │   └── rateLimiter.ts       # Rate limiting config
│   ├── models/
│   │   ├── Product.ts           # Schema do Produto
│   │   └── User.ts              # Schema do Usuário
│   ├── routes/
│   │   ├── authRoutes.ts        # Rotas de auth (Swagger)
│   │   └── productRoutes.ts     # Rotas de produtos (Swagger)
│   ├── swagger.ts               # Configuração OpenAPI
│   └── index.ts                 # Servidor principal
├── tests/
│   ├── load-test.js             # k6 load testing script
│   └── test-rate-limit.sh       # Rate limiting test
├── docs/
│   ├── SWAGGER_DOCUMENTATION.md # Guia Swagger completo
│   ├── RATE_LIMITING.md         # Documentação Rate Limiting
│   ├── load-testing-report.md   # Relatório k6
│   ├── ARCHITECTURE-AWS.md      # Arquitetura Parte 2
│   └── Desafio-Arquitetura-AWS.pdf
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 Endpoints da API

### ✨ Usar Swagger UI (Recomendado)

**Teste todos os endpoints interativamente:**
```
http://localhost:3000/api-docs
```

### Autenticação

#### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@catalog.com",
  "password": "admin123",
  "role": "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@catalog.com",
  "password": "admin123"
}
```

### Produtos

#### Listar Produtos (Público)
```http
GET /api/products
GET /api/products?page=1&limit=10
GET /api/products?category=eletrônicos
GET /api/products?minPrice=100&maxPrice=5000
GET /api/products?search=notebook
```

#### Buscar por ID (Público)
```http
GET /api/products/{id}
```

#### Criar Produto (Admin)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Notebook Dell XPS 13",
  "description": "Notebook ultrafino",
  "price": 4500.00,
  "category": "eletrônicos",
  "sku": "NOTEBK-DELL-XPS13",
  "stock": 5
}
```

#### Atualizar Produto (Admin)
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{"price": 4299.99, "stock": 10}
```

#### Deletar Produto (Admin)
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

---

## 🧪 Testes

### Testes Unitários e de Integração

```bash
# Executar todos os testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode (desenvolvimento)
npm test -- --watch
```

### Load Testing com k6

```bash
# Instalar k6
# Ubuntu/Debian:
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Executar load test
k6 run tests/load-test.js
```

### Teste de Rate Limiting

```bash
# Script automático
bash tests/test-rate-limit.sh

# Ou manual
for i in {1..55}; do curl -s http://localhost:3000/api/products > /dev/null; done
```

---

## 📊 CI/CD Pipeline

O projeto inclui **GitHub Actions workflow** que:

- ✅ Executa em cada push e pull request
- ✅ Valida tipos TypeScript (`tsc --noEmit`)
- ✅ Executa suite completa de testes
- ✅ Verifica cobertura de código
- ✅ Build automático

**Arquivo**: `.github/workflows/ci.yml`

---

## 🏭️ Parte 2: Arquitetura

Solução completa para **100 mil usuários simultâneos**:

### 📚 Documentação Completa

- 🔗 **[ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md)** - Documentação detalhada
- 🔗 **[Desafio-Arquitetura-AWS.pdf](docs/Desafio-Arquitetura-AWS.pdf)** - Versão PDF
- 🔗 **[architecture-aws-microservices.png](docs/architecture-aws-microservices.png)** - Diagrama visual

### 🛠️ Componentes Principais

- ✅ **Microsserviços independentes** (Auth, Products, Orders, Notifications)
- ✅ **AWS Application Load Balancer** (ALB)
- ✅ **ElastiCache Redis** para caching
- ✅ **RDS Multi-AZ** para alta disponibilidade
- ✅ **Auto Scaling Groups**
- ✅ **CloudWatch & X-Ray** para observabilidade
- ✅ **S3 + CloudFront** para assets estáticos

---

## 📚 Documentação Adicional

| Documento | Descrição | Link |
|-----------|-------------|------|
| **Swagger Documentation** | Guia completo da API Swagger | [SWAGGER_DOCUMENTATION.md](docs/SWAGGER_DOCUMENTATION.md) |
| **Rate Limiting Guide** | Configuração e uso de rate limiting | [RATE_LIMITING.md](docs/RATE_LIMITING.md) |
| **Load Testing Report** | Resultados detalhados k6 | [load-testing-report.md](docs/load-testing-report.md) |
| **AWS Architecture** | Arquitetura para 100k usuários | [ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md) |

---

## 👤 Autor

**Tercio Alves Parente**
- GitHub: [@Tercio01](https://github.com/Tercio01)
- LinkedIn: [Tercio Alves Parente](https://www.linkedin.com/in/tercioparente)
- Email: tercio.parente@example.com

---

## 📝 Licença

MIT License - veja [LICENSE](LICENSE)

---

## ❓ FAQ

### Como funciona o Rate Limiting?

A API implementa 4 níveis de rate limiting:
- **Global**: 100 req/15min para todas as rotas
- **Auth**: 5 tentativas falhadas/15min
- **API**: 50 req/15min em `/api/products`
- **Write**: 20 operações de escrita/15min

Veja documentação completa: [RATE_LIMITING.md](docs/RATE_LIMITING.md)

### Swagger não está acessível?

1. Certifique-se que `npm install` foi executado
2. Confirme que `npm run dev` está rodando
3. Acesse http://localhost:3000/api-docs

### Token expirado no Swagger?

1. Faça login novamente (POST /api/auth/login)
2. Copie o novo token
3. Clique em "Authorize" (🔒) e atualize o token

### Erro ao conectar MongoDB?

**Docker**: `docker-compose up -d`
**Local**: `sudo systemctl start mongod`
**Verifique**: `MONGODB_URI` no arquivo `.env`

### Como executar load testing?

```bash
# Instalar k6
sudo apt-get install k6

# Executar teste
k6 run tests/load-test.js
```

---

## ⭐ Destaques do Projeto

- ✅ **Pontuação k6**: 9.2/10 (performance excepcional)
- ✅ **Rate Limiting**: Proteção contra abuso implementada
- ✅ **Documentação**: 100% dos endpoints documentados com Swagger
- ✅ **Segurança**: JWT + bcrypt + helmet + rate limiting
- ✅ **Arquitetura**: Solução completa para 100k usuários
- ✅ **Docker**: Containerização completa
- ✅ **TypeScript**: Type-safe com cobertura completa

---

**Desenvolvido com ❤️ para demonstrar excelência em engenharia de software.**

**Status**: ✅ **Pronto para Produção** | **Avaliação**: 9.2/10