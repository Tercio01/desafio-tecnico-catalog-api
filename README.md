# 🚀 Desafio Técnico - Engenheiro de Software 

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4-green)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen)](https://swagger.io/)
[![K6 Load Test](https://img.shields.io/badge/K6%20Load%20Test-9.8%2F10-brightgreen)](docs/K6_LOAD_TEST_FINAL.html)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Este repositório contém a solução completa para o **Desafio Técnico de Engenheiro de Software Júnior**, desenvolvido com Node.js, TypeScript, Express, MongoDB, JWT e documentação Swagger/OpenAPI.

---

## ⚡ Quick Start

Get running in 2 minutes:

```bash
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api
npm install
npm run dev

# API running at http://localhost:3000 🚀
# Swagger UI at http://localhost:3000/api-docs 📚
```

---

## 📋 Índice

- [Sobre o Desafio](#sobre-o-desafio)
- [⚡ Quick Start](#-quick-start)
- [📚 Documentação Swagger](#-documentação-swagger)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [🧪 Testes](#-testes)
- [📊 CI/CD Pipeline](#-cicd-pipeline)
- [Parte 2: Arquitetura](#parte-2-arquitetura)
- [Autor](#autor)

---

## 📖 Sobre o Desafio

O desafio é dividido em duas partes:

### **Parte 1: Desenvolvimento de Aplicação Completa**

Desenvolver uma **API REST** que:
- ✅ Gerencie um catálogo de produtos (CRUD completo)
- ✅ Inclua autenticação JWT
- ✅ Implemente paginação e filtros
- ✅ Use containerização com Docker
- ✅ Tenha documentação da API com Swagger/OpenAPI
- ✅ Inclua testes unitários e de integração

### **Parte 2: Arquitetura e Design**

Criar um **diagrama de arquitetura** para escalar a aplicação para **100 mil usuários simultâneos**, incluindo:
- ✅ Microsserviços
- ✅ Balanceamento de carga
- ✅ Cache
- ✅ Estratégia de alta disponibilidade
- ✅ Serviços AWS

---

## 📚 Documentação Swagger

### 🎯 Acessar Documentação Interativa

```bash
# Após iniciar a aplicação:
npm run dev

# Abra no navegador:
http://localhost:3000/api-docs
```

### 📖 Recursos Swagger

| Recurso | URL | Descrição |
|---------|-----|----------|
| **Swagger UI** | http://localhost:3000/api-docs | Interface interativa para testar endpoints |
| **OpenAPI JSON** | http://localhost:3000/openapi.json | Especificação OpenAPI 3.0 em JSON |
| **Documentação Detalhada** | [docs/SWAGGER_DOCUMENTATION.md](docs/SWAGGER_DOCUMENTATION.md) | Guia completo da API |

### ✨ Recursos da Documentação

- ✅ **OpenAPI 3.0.0** - Especificação moderna e padronizada
- ✅ **Swagger UI** - Interface interativa com tema customizado
- ✅ **Autenticação JWT** - Integrada no Swagger para testar endpoints protegidos
- ✅ **Modelos (Schemas)** - Definição clara de User e Product
- ✅ **Exemplos** - Request/Response para cada endpoint
- ✅ **Persistência de Token** - "Remember me" para autenticação
- ✅ **Filtros** - Documentação de paginação, busca e filtros

### 🔐 Como Testar Endpoints Protegidos no Swagger

1. **Abrir Swagger UI**: http://localhost:3000/api-docs
2. **Registrar usuário** (POST /api/auth/register)
3. **Fazer login** (POST /api/auth/login)
4. **Copiar token** da resposta
5. **Clicar em "Authorize" (🔒)** no topo direito
6. **Colar token** no campo de autorização
7. **Testar endpoints protegidos** (Create, Update, Delete)

### 📝 Exemplo com curl

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@catalog.com",
    "password": "admin123",
    "role": "admin"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@catalog.com","password":"admin123"}'

# 3. Usar token em endpoints protegidos
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell",
    "price": 2999.99,
    "category": "eletrônicos",
    "sku": "DELL-NB-001",
    "stock": 10
  }'
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** 22.x - Runtime JavaScript
- **TypeScript** 5.x - Superset tipado do JavaScript
- **Express** 5.x - Framework web minimalista
- **MongoDB** 8.x - Banco de dados NoSQL

### Autenticação e Segurança
- **JWT (jsonwebtoken)** - Autenticação stateless
- **bcryptjs** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing
- **Helmet.js** - HTTP security headers

### Documentação
- **Swagger UI Express** - Interface interativa
- **Swagger JSDoc** - Geração de especificação OpenAPI

### Desenvolvimento
- **ts-node** - Execução de TypeScript
- **nodemon** - Hot-reloading em desenvolvimento
- **Docker** - Containerização
- **Jest** - Testing framework

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (versão 4.4 ou superior)
- [Git](https://git-scm.com/)

**Opcional (recomendado):**
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Instalação e Execução

### Opção 1: Execução com Docker (Recomendado)

Esta é a forma mais simples e rápida de executar o projeto:

```bash
# 1. Clone o repositório
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# 2. Execute com Docker Compose
docker-compose up --build

# 3. A API estará disponível em http://localhost:3000
# 4. Swagger UI: http://localhost:3000/api-docs
```

### Opção 2: Execução Local (Sem Docker)

```bash
# 1. Clone o repositório
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# ⚠️ IMPORTANTE: Nunca faça commit do arquivo `.env`!
# Use `.env.example` como referência, mantendo dados sensíveis apenas localmente.

# 4. Certifique-se de que o MongoDB está rodando
sudo systemctl start mongod

# 5. Compile o TypeScript
npm run build

# 6. Execute a aplicação
npm start

# OU em modo desenvolvimento (com hot-reload)
npm run dev
```

A API estará disponível em **http://localhost:3000**
Swagger UI em **http://localhost:3000/api-docs**

---

## 📁 Estrutura do Projeto

```
catalog-api/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração do MongoDB
│   ├── controllers/
│   │   ├── authController.ts    # Lógica de autenticação
│   │   └── productController.ts # Lógica de produtos
│   ├── middleware/
│   │   └── auth.ts              # Middleware de autenticação JWT
│   ├── models/
│   │   ├── Product.ts           # Schema do Produto
│   │   └── User.ts              # Schema do Usuário
│   ├── routes/
│   │   ├── authRoutes.ts        # Rotas de autenticação (com Swagger)
│   │   └── productRoutes.ts     # Rotas de produtos (com Swagger)
│   ├── swagger.ts               # Configuração OpenAPI/Swagger
│   └── index.ts                 # Arquivo principal (Swagger UI setup)
├── tests/
│   └── (testes unitários e de integração)
├── docs/
│   ├── SWAGGER_DOCUMENTATION.md # Guia Swagger detalhado
│   ├── ARCHITECTURE-AWS.md      # Documentação da arquitetura
│   ├── Desafio-Arquitetura-AWS.pdf
│   └── K6_LOAD_TEST_FINAL.html # Load testing results
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore
├── docker-compose.yml           # Configuração do Docker Compose
├── Dockerfile                   # Dockerfile da aplicação
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 Endpoints da API

### ✨ Usar Swagger UI para Testar

**Recomendamos usar o Swagger UI para testar os endpoints:**
```
http://localhost:3000/api-docs
```

### Autenticação

#### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Tercio Parente",
  "email": "tercio@example.com",
  "password": "123456",
  "role": "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tercio@example.com",
  "password": "123456"
}
```

### Produtos

#### Listar Produtos (Público)
```http
GET /api/products
GET /api/products?page=1&limit=10
GET /api/products?category=eletrônicos
GET /api/products?minPrice=100&maxPrice=5000
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
  "name": "Notebook Dell",
  "price": 2999.99,
  "category": "eletrônicos",
  "sku": "DELL-NB-001",
  "stock": 10
}
```

#### Atualizar (Admin)
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{"price": 2799.99, "stock": 15}
```

#### Deletar (Admin)
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

---

## 🧪 Testes

```bash
# Executar testes
npm test

# Com coverage
npm test -- --coverage
```

---

## 📊 CI/CD Pipeline

O projeto inclui um **GitHub Actions workflow** que:
- ✅ Testa em cada push
- ✅ Valida tipos TypeScript
- ✅ Executa suite de testes
- ✅ Verifica cobertura

---

## 🏗️ Parte 2: Arquitetura

A solução completa da **Parte 2 do desafio** (Arquitetura para 100k usuários) está documentada em:

- **📄 [ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md)** - Documentação em Markdown
- **📄 [Desafio-Arquitetura-AWS.pdf](docs/Desafio-Arquitetura-AWS.pdf)** - Versão em PDF
- **🖼️ [architecture-aws-microservices.png](docs/architecture-aws-microservices.png)** - Diagrama visual

### Destaques:
- ✅ Microsserviços independentes
- ✅ AWS ALB para load balancing
- ✅ ElastiCache Redis
- ✅ Multi-AZ deployment
- ✅ Auto Scaling
- ✅ CloudWatch e X-Ray

---

## 👤 Autor

**Tercio Alves Parente**
- GitHub: [@Tercio01](https://github.com/Tercio01)
- LinkedIn: [Tercio Alves Parente](https://www.linkedin.com/in/tercioparente)

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE)

---

## ❓ FAQ

### Swagger não está acessível?
- Certifique-se de executar `npm install` para instalar dependências
- Confirme que npm run dev está rodando
- Acesse http://localhost:3000/api-docs

### Token expirado no Swagger?
- Faça login novamente (POST /api/auth/login)
- Copie o novo token
- Clique em "Authorize" e atualize o token

### Erro ao conectar MongoDB?
- Se usando Docker: `docker-compose up -d`
- Se local: `sudo systemctl start mongod`
- Verifique `MONGODB_URI` no `.env`

---

**Desenvolvido com ❤️ para demonstrar excelência em engenharia de software.**