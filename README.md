# 🚀 Desafio Técnico - Engenheiro de Software Júnior

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Este repositório contém a solução completa para o **Desafio Técnico de Engenheiro de Software Júnior**, desenvolvido com Node.js, TypeScript, Express, MongoDB e JWT.

---

## 📋 Índice

- [Sobre o Desafio](#sobre-o-desafio)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
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
- ✅ Tenha documentação da API
- ✅ Inclua testes unitários e de integração

### **Parte 2: Arquitetura e Design**

Criar um **diagrama de arquitetura** para escalar a aplicação para **100 mil usuários simultâneos**, incluindo:
- ✅ Microsserviços
- ✅ Balanceamento de carga
- ✅ Cache
- ✅ Estratégia de alta disponibilidade
- ✅ Serviços AWS

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

### Desenvolvimento
- **ts-node** - Execução de TypeScript
- **nodemon** - Hot-reloading em desenvolvimento
- **Docker** - Containerização

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
git clone <URL_DO_REPOSITORIO>
cd catalog-api

# 2. Execute com Docker Compose
docker-compose up --build

# 3. A API estará disponível em http://localhost:3000
```

### Opção 2: Execução Local (Sem Docker)

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd catalog-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Certifique-se de que o MongoDB está rodando
# Se instalado localmente:
sudo systemctl start mongod

# 5. Compile o TypeScript
npm run build

# 6. Execute a aplicação
npm start

# OU execute em modo de desenvolvimento (com hot-reload)
npm run dev
```

A API estará disponível em **http://localhost:3000**

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
│   │   ├── authRoutes.ts        # Rotas de autenticação
│   │   └── productRoutes.ts     # Rotas de produtos
│   └── index.ts                 # Arquivo principal
├── tests/
│   └── (testes unitários e de integração)
├── docs/
│   ├── ARCHITECTURE-AWS.md      # Documentação da arquitetura
│   └── Desafio-Arquitetura-AWS.pdf
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

### Autenticação

#### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Tercio Parente",
  "email": "tercio1parente@gmail.com",
  "password": "123456",
  "role": "admin"  // ou "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tercio1parente@gmail.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "id": "...",
    "name": "Tercio Parente",
    "email": "tercio1parente@gmail.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Produtos

#### Listar Produtos (Público)
```http
GET /api/products
GET /api/products?category=eletrônicos
GET /api/products?minPrice=100&maxPrice=1000
GET /api/products?search=samsung
```

#### Buscar Produto por ID (Público)
```http
GET /api/products/:id
```

#### Criar Produto (Requer autenticação de Admin)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Smartphone Samsung Galaxy",
  "description": "Smartphone Android com 128GB",
  "price": 1299.99,
  "category": "eletrônicos",
  "sku": "SM-GALAXY-001",
  "stock": 50
}
```

#### Atualizar Produto (Requer autenticação de Admin)
```http
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 1199.99,
  "stock": 45
}
```

#### Deletar Produto (Requer autenticação de Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {token}
```

### Health Check
```http
GET /health
```

---

## 🧪 Testes

### Executar Testes Manuais

Após iniciar a aplicação, você pode testar os endpoints usando `curl`:

```bash
# 1. Registrar um usuário admin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@catalog.com",
    "password": "admin123",
    "role": "admin"
  }'

# 2. Fazer login e obter o token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@catalog.com",
    "password": "admin123"
  }'

# 3. Criar um produto (substitua {TOKEN} pelo token recebido)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "name": "Notebook Dell",
    "description": "Notebook com Intel i5",
    "price": 2999.99,
    "category": "eletrônicos",
    "sku": "DELL-NB-001",
    "stock": 10
  }'

# 4. Listar produtos
curl http://localhost:3000/api/products
```

---

## 🏗️ Parte 2: Arquitetura

A solução completa da **Parte 2 do desafio** (Arquitetura para 100k usuários) está documentada em:

- **📄 [ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md)** - Documentação completa em Markdown
- **📄 [Desafio-Arquitetura-AWS.pdf](docs/Desafio-Arquitetura-AWS.pdf)** - Versão em PDF
- **🖼️ [architecture-aws-microservices.png](docs/architecture-aws-microservices.png)** - Diagrama visual

### Destaques da Arquitetura:

- ✅ **Microsserviços** independentes (Product, Auth, Search, Analytics)
- ✅ **AWS Application Load Balancer** para balanceamento de carga
- ✅ **ElastiCache Redis** para cache distribuído
- ✅ **Multi-AZ deployment** para alta disponibilidade
- ✅ **Auto Scaling** baseado em métricas
- ✅ **RDS PostgreSQL** com read replicas
- ✅ **Monitoramento** com CloudWatch e X-Ray

---

## 👤 Autor

**Tercio Alves Parente**

- GitHub: [@Tercio01](https://github.com/Tercio01)
- LinkedIn: [Tercio Alves Parente](www.linkedin.com/in/tercioparente)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

Obrigado pela oportunidade de participar deste desafio técnico. O projeto foi desenvolvido com dedicação e seguindo as melhores práticas de desenvolvimento de software.
