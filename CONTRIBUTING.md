# 📝 Guia para Avaliadores

Este documento fornece instruções detalhadas para avaliar o desafio técnico.

## 🚀 Início Rápido (3 minutos)

A forma mais rápida de testar o projeto é usando Docker:

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd catalog-api

# 2. Execute com Docker Compose
docker-compose up --build

# 3. Em outro terminal, execute os testes automatizados
./test-api.sh
```

Pronto! A API estará rodando em `http://localhost:3000` e todos os testes serão executados automaticamente.

---

## 📋 Checklist de Avaliação

### Parte 1: Desenvolvimento da Aplicação

- [ ] **CRUD Completo de Produtos**
  - [ ] Criar produto (POST /api/products)
  - [ ] Listar produtos (GET /api/products)
  - [ ] Buscar produto por ID (GET /api/products/:id)
  - [ ] Atualizar produto (PUT /api/products/:id)
  - [ ] Deletar produto (DELETE /api/products/:id)

- [ ] **Autenticação JWT**
  - [ ] Registro de usuário (POST /api/auth/register)
  - [ ] Login de usuário (POST /api/auth/login)
  - [ ] Proteção de rotas com middleware JWT
  - [ ] Controle de acesso por role (admin/user)

- [ ] **Paginação e Filtros**
  - [ ] Filtro por categoria (?category=eletrônicos)
  - [ ] Filtro por faixa de preço (?minPrice=100&maxPrice=1000)
  - [ ] Busca por texto (?search=samsung)

- [ ] **Containerização**
  - [ ] Dockerfile funcional
  - [ ] Docker Compose com MongoDB
  - [ ] Health checks configurados

- [ ] **Documentação**
  - [ ] README.md completo
  - [ ] Instruções de instalação claras
  - [ ] Exemplos de uso da API

### Parte 2: Arquitetura e Design

- [ ] **Diagrama de Arquitetura**
  - [ ] Visualização clara da arquitetura
  - [ ] Microsserviços identificados
  - [ ] Componentes AWS especificados

- [ ] **Requisitos Técnicos**
  - [ ] Balanceamento de carga (ALB)
  - [ ] Cache (ElastiCache Redis)
  - [ ] Alta disponibilidade (Multi-AZ)
  - [ ] Escalabilidade para 100k usuários

- [ ] **Documentação**
  - [ ] Explicação detalhada da arquitetura
  - [ ] Justificativa das escolhas técnicas
  - [ ] Estimativas de recursos

---

## 🧪 Testes Detalhados

### 1. Teste Manual com cURL

#### Registrar Usuário Admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@catalog.com",
    "password": "admin123",
    "role": "admin"
  }'
```

#### Fazer Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@catalog.com",
    "password": "admin123"
  }'
```

**Copie o token retornado e use nas próximas requisições.**

#### Criar Produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SEU_TOKEN_AQUI}" \
  -d '{
    "name": "Smartphone Samsung Galaxy",
    "description": "Smartphone Android com 128GB",
    "price": 1299.99,
    "category": "eletrônicos",
    "sku": "SM-GALAXY-001",
    "stock": 50
  }'
```

#### Listar Produtos
```bash
curl http://localhost:3000/api/products
```

#### Filtrar por Categoria
```bash
curl "http://localhost:3000/api/products?category=eletrônicos"
```

### 2. Teste Automatizado

Execute o script de teste automatizado:

```bash
./test-api.sh
```

Este script testa todos os endpoints principais e valida as respostas.

---

## 🔍 Pontos de Atenção

### Qualidade do Código
- ✅ TypeScript com tipagem forte
- ✅ Código organizado em camadas (controllers, models, routes, middleware)
- ✅ Tratamento de erros adequado
- ✅ Validações de dados

### Segurança
- ✅ Senhas hasheadas com bcrypt
- ✅ JWT para autenticação stateless
- ✅ Middleware de autorização por role
- ✅ Validações de entrada

### Boas Práticas
- ✅ Variáveis de ambiente (.env)
- ✅ .gitignore configurado
- ✅ Documentação completa
- ✅ Estrutura de projeto escalável

---

## 📊 Critérios de Avaliação Sugeridos

| Critério | Peso | Observações |
|:---|:---:|:---|
| **Funcionalidade** | 30% | CRUD completo, autenticação, filtros |
| **Qualidade do Código** | 25% | Organização, tipagem, boas práticas |
| **Documentação** | 20% | README, comentários, clareza |
| **Arquitetura (Parte 2)** | 15% | Diagrama, escalabilidade, AWS |
| **Containerização** | 10% | Docker, Docker Compose |

---

## ❓ Perguntas Frequentes

### A API não está iniciando
- Verifique se o MongoDB está rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs api`
- Certifique-se de que a porta 3000 não está em uso

### Erro de autenticação
- Verifique se o token JWT está sendo enviado corretamente no header `Authorization: Bearer {token}`
- Certifique-se de que o usuário tem a role adequada (admin para criar/atualizar/deletar)

### Como parar os containers
```bash
docker-compose down
```

### Como limpar tudo e recomeçar
```bash
docker-compose down -v
docker-compose up --build
```

---

## 📞 Contato

Se tiver dúvidas durante a avaliação, sinta-se à vontade para abrir uma issue no repositório.

**Obrigado por avaliar este projeto!** 🙏
