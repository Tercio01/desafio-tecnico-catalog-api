# 🚀 Desafio Técnico - Engenheiro de Software Júnior

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI/CD Pipeline](https://github.com/Tercio01/desafio-tecnico-catalog-api/actions/workflows/ci.yml/badge.svg)](https://github.com/Tercio01/desafio-tecnico-catalog-api/actions)
[![Tests](https://img.shields.io/badge/Tests-16%20Passing-brightgreen)](./tests)
[![Code Quality](https://img.shields.io/badge/Lint-0%20Warnings-brightgreen)](./src)

> **Status:** ✅ Production Ready | 🔄 100% CI/CD Automated | 📊 16 Tests | 🔒 Secure | 📈 Scalable

Este repositório contém a solução completa para o **Desafio Técnico de Engenheiro de Software Júnior**, desenvolvido com Node.js, TypeScript, Express, MongoDB e JWT.

---

## 📋 Índice

- [Sobre o Desafio](#sobre-o-desafio)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [📊 CI/CD Pipeline](#-cicd-pipeline)
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
- ✅ Tenha documentação da API (Swagger)
- ✅ Inclua testes unitários e de integração
- ✅ Implemente CI/CD com GitHub Actions
- ✅ Code quality com ESLint (0 warnings)

### **Parte 2: Arquitetura e Design**

Criar um **diagrama de arquitetura** para escalar a aplicação para **100 mil usuários simultâneos**, incluindo:

- ✅ Microsserviços independentes
- ✅ Balanceamento de carga (AWS ALB)
- ✅ Cache distribuído (ElastiCache Redis)
- ✅ Estratégia de alta disponibilidade (Multi-AZ)
- ✅ Auto Scaling e monitoramento
- ✅ Serviços AWS (RDS, EC2, S3, CloudWatch)

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** 22.x - Runtime JavaScript
- **TypeScript** 5.x - Type-safe development
- **Express** 5.x - Web framework
- **MongoDB** 8.x - NoSQL database

### Autenticação e Segurança

- **JWT (jsonwebtoken)** - Stateless authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Testes e Qualidade

- **Jest** - Unit and integration tests
- **Supertest** - HTTP assertion library
- **ESLint** - Code linting (0 warnings)
- **TypeScript Compiler** - Type checking

### DevOps & Deployment

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD automation
- **Node.js Matrix** - Multi-version testing (18.x, 20.x, 22.x)

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- MongoDB (versão 4.4 ou superior)
- Git
- Docker e Docker Compose (recomendado)

## 🚀 Instalação e Execução

### Opção 1: Execução com Docker (Recomendado)

1. Clone o repositório

git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd catalog-api
2. Execute com Docker Compose

docker-compose up --build
3. A API estará disponível em http://localhost:3000
4. Mongo Express em http://localhost:8081

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
OU em modo desenvolvimento (com hot-reload)

npm run dev

text

A API estará disponível em [**http://localhost:3000**](http://localhost:3000)

---

## 📁 Estrutura do Projeto

catalog-api/
├── src/
│ ├── config/ # Configurações (database, etc)
│ ├── controllers/ # Lógica de negócio
│ ├── middleware/ # Middlewares (auth, error, etc)
│ ├── models/ # Schemas MongoDB
│ ├── routes/ # Rotas da API
│ ├── utils/ # Utilitários (logger, etc)
│ └── index.ts # Entrada principal
├── tests/ # Testes automatizados
├── docs/ # Documentação
├── .env.example # Variáveis de exemplo
├── docker-compose.yml # Orquestração de containers
├── Dockerfile # Imagem Docker
├── tsconfig.json # Configuração TypeScript
├── .eslintrc.json # Configuração ESLint
└── README.md # Este arquivo

text

---

## 🔌 Endpoints da API

### Autenticação

POST /api/auth/register # Registrar novo usuário
POST /api/auth/login # Fazer login e receber JWT
GET /api/auth/me # Dados do usuário autenticado

text

### Produtos

GET /api/products # Listar todos os produtos
GET /api/products?category=... # Filtrar por categoria
GET /api/products?search=... # Buscar por nome/descrição
GET /api/products?minPrice=... # Filtrar por preço mínimo
GET /api/products?maxPrice=... # Filtrar por preço máximo
GET /api/products/:id # Buscar produto específico
POST /api/products # Criar novo produto (admin)
PUT /api/products/:id # Atualizar produto (admin)
DELETE /api/products/:id # Deletar produto (admin)

text

### Health Check

GET /health # Status da aplicação

text

### Documentação Interativa

http://localhost:3000/api-docs # Swagger UI

text

---

## 📊 CI/CD Pipeline

Este projeto implementa um **pipeline CI/CD completo** com GitHub Actions, garantindo qualidade e confiabilidade em cada commit.

### 🔄 Workflow Automatizado

**Arquivo:** `.github/workflows/ci.yml`

O pipeline é acionado em cada push para a branch `main` e executa:

#### 1️⃣ **Build & Test (Matrix Strategy)**

Compila e testa em **3 versões do Node.js** simultaneamente:

- Node.js 18.x - LTS estável
- Node.js 20.x - LTS recente
- Node.js 22.x - Versão atual

**Etapas:**
- ✅ Instalação de dependências
- ✅ Compilação TypeScript (`npm run build`)
- ✅ Execução de testes (`npm test`)
- ✅ Cobertura de testes (68.26%)
- ✅ 16/16 testes passando

#### 2️⃣ **Code Quality (Linting)**

Valida a qualidade do código:

- ✅ ESLint - 0 warnings
- ✅ TypeScript strict mode
- ✅ Sem console.log em produção
- ✅ Tipos explícitos (sem `any`)

#### 3️⃣ **Security Audit**

Verifica dependências de segurança:

- ✅ npm audit - Sem vulnerabilidades
- ✅ Dependências atualizadas
- ✅ Licenças compatíveis

#### 4️⃣ **Docker Build**

Constrói a imagem Docker:

- ✅ Multi-stage build otimizado
- ✅ Imagem compactada (~200MB)
- ✅ Ready para produção

### 📈 Métricas de Qualidade

| Métrica | Status |
|---------|--------|
| **Tests Passing** | 16/16 ✅ |
| **Coverage** | 68.26% ✅ |
| **Linting** | 0 warnings ✅ |
| **Security** | No vulnerabilities ✅ |
| **TypeScript** | Strict mode ✅ |
| **Docker Build** | Success ✅ |

### 🚀 Como o Pipeline Melhora o Projeto

1. **Confiabilidade** - Todos os commits são validados automaticamente
2. **Qualidade** - Lint e testes garantem código limpo
3. **Segurança** - Auditorias detectam vulnerabilidades
4. **Reproduzibilidade** - Docker garante que funciona em qualquer lugar
5. **DevOps Ready** - Preparado para CD (Continuous Deployment)

### 📋 Visualizar o Pipeline

Acesse: [GitHub Actions](https://github.com/Tercio01/desafio-tecnico-catalog-api/actions)

---

## 🧪 Testes

Rodar todos os testes

npm test
Modo watch (rerun on changes)

npm run test:watch
Com cobertura de código

npm run test:coverage

text

**Resultado Atual:**
- ✅ 16 testes passando
- ✅ 68.26% de cobertura
- ✅ Testes de autenticação, produtos e middleware

---

## 📚 Documentação Interativa

Abra no navegador: [**http://localhost:3000/api-docs**](http://localhost:3000/api-docs)

Aqui você pode:
- 📖 Explorar todos os endpoints
- 🧪 Testar requests diretamente
- 📝 Ver schemas de request/response
- 🔐 Autenticar com JWT

---

## 🏗️ Parte 2: Arquitetura

Documentação completa em:

- **📄 [ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md)** - Documentação em Markdown
- **📄 [Desafio-Arquitetura-AWS.pdf](docs/Desafio-Arquitetura-AWS.pdf)** - Versão em PDF
- **🖼️ [Diagrama Visual](docs/architecture-aws-microservices.png)** - Arquitetura em diagrama

### Destaques da Solução:

- ✅ **Microsserviços** - API Gateway, Product Service, Auth Service, Search Service
- ✅ **Load Balancing** - AWS Application Load Balancer
- ✅ **Cache** - ElastiCache Redis (5GB)
- ✅ **Database** - RDS PostgreSQL Multi-AZ com read replicas
- ✅ **Auto Scaling** - Escalabilidade horizontal automática
- ✅ **High Availability** - Multi-AZ deployment (3 AZs)
- ✅ **Monitoring** - CloudWatch + X-Ray
- ✅ **CDN** - CloudFront para conteúdo estático

**Capacidade:** 100.000+ usuários simultâneos ⚡

---

## 👤 Autor

**Tercio Alves Parente**

- **GitHub:** [@Tercio01](https://github.com/Tercio01)
- **LinkedIn:** [Tercio Alves Parente](https://www.linkedin.com/in/tercioparente)
- **Email:** tercio1parente@gmail.com

---

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes

---

## ❓ FAQ & Troubleshooting

### Porta 3000 já está em uso

lsof -i :3000
kill <PID>

text

### MongoDB não está rodando

Com Docker Compose

docker-compose up -d
Ou localmente

sudo systemctl start mongod

text

### Dependências faltando

npm install

text

### Erro ao fazer build

npm run build -- --diagnostics
npm run lint

text

---

## 🎯 Próximos Passos (Roadmap)

- [ ] Implementar rate limiting
- [ ] Adicionar criptografia de dados sensíveis
- [ ] Implementar soft delete para produtos
- [ ] Adicionar webhooks para eventos
- [ ] Deploy automático em staging/production
- [ ] Monitoring com Datadog/New Relic

---

**Desenvolvido com ❤️ para o Desafio Técnico**

*Last Updated: November 27, 2025*
