# 🚀 Desafio Técnico - Engenheiro de Software Júnior

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=github)](https://github.com/Tercio01/desafio-tecnico-catalog-api/actions)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-green?logo=swagger)](http://localhost:3000/api-docs)
[![Tests](https://img.shields.io/badge/Tests-16%20Passing-brightgreen)](./test)

> **Status:** ✅ Production Ready | 📊 16 Tests | 🔒 Secure | 📈 Scalable

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
- **Zod** - Validação de schemas
- **Pino** - Logging estruturado

### Desenvolvimento

- **ts-node** - Execução de TypeScript
- **nodemon** - Hot-reloading em desenvolvimento
- **Docker** - Containerização
- **Jest + Supertest** - Testes
- **ESLint** - Linting

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- MongoDB (versão 4.4 ou superior)
- Git

**Opcional (recomendado):**

- Docker e Docker Compose

## 🚀 Instalação e Execução

### Opção 1: Execução com Docker (Recomendado)

1. Clone o repositório

git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd catalog-api
2. Execute com Docker Compose

docker-compose up --build
3. A API estará disponível em http://localhost:3000

text

### Opção 2: Execução Local (Sem Docker)

1. Clone o repositório

git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd catalog-api
2. Instale as dependências

npm install
3. Configure as variáveis de ambiente

cp .env.example .env
4. Certifique-se de que o MongoDB está rodando

sudo systemctl start mongod
5. Compile o TypeScript

npm run build
6. Execute a aplicação

npm start
OU em modo desenvolvimento

npm run dev

text

A API estará disponível em [**http://localhost:3000**](http://localhost:3000)

## 📁 Estrutura do Projeto

catalog-api/
├── src/
│ ├── config/ # Configurações
│ ├── controllers/ # Lógica de negócio
│ ├── middleware/ # Middlewares
│ ├── models/ # Schemas MongoDB
│ ├── routes/ # Rotas API
│ ├── schemas/ # Validação Zod
│ └── index.ts # Entrada principal
├── tests/ # Testes automatizados
├── docs/ # Documentação
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md

text

## 🔌 Endpoints da API

### Autenticação

POST /api/auth/register # Registrar usuário
POST /api/auth/login # Fazer login

text

### Produtos

GET /api/products # Listar todos
GET /api/products?category=... # Filtrar por categoria
GET /api/products/:id # Buscar por ID
POST /api/products # Criar (requer admin)
PUT /api/products/:id # Atualizar (requer admin)
DELETE /api/products/:id # Deletar (requer admin)

text

### Health

GET /health # Status da aplicação

text

## 🧪 Testes

npm test # Rodar todos os testes
npm run test:watch # Modo watch
npm run test:coverage # Com cobertura

text

## 📚 Documentação Interativa

Abra: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🏗️ Parte 2: Arquitetura

Documentação completa em:
- [ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md)
- [Desafio-Arquitetura-AWS.pdf](docs/Desafio-Arquitetura-AWS.pdf)

### Destaques:

- ✅ Microsserviços independentes
- ✅ AWS Application Load Balancer
- ✅ ElastiCache Redis
- ✅ Multi-AZ deployment
- ✅ Auto Scaling
- ✅ RDS PostgreSQL com read replicas
- ✅ CloudWatch + X-Ray

---

## 👤 Autor

**Tercio Alves Parente**

- GitHub: [@Tercio01](https://github.com/Tercio01)
- LinkedIn: [Tercio Alves Parente](https://www.linkedin.com/in/tercioparente)

---

## 📄 Licença

MIT - Veja [LICENSE](LICENSE)

---

## ❓ FAQ

**Porta já em uso?**

lsof -i :3000
kill <PID>

text

**MongoDB não rodando?**

docker-compose up -d
ou

sudo systemctl start mongod

text

**Dependências faltando?**

npm install

text

---

Desenvolvido com ❤️ para o Desafio Técnico
