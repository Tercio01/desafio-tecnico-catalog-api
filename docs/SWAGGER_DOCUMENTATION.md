# 📚 Documentação Swagger/OpenAPI - Catalog API

## 📋 Visão Geral

Esta API segue a especificação **OpenAPI 3.0.0** e fornece documentação interativa via **Swagger UI**.

### 🔗 Acessar Documentação

```bash
# Local (desenvolvimento)
http://localhost:3000/api-docs

# JSON da especificação OpenAPI
http://localhost:3000/openapi.json
```

---

## 🚀 Como Usar a Documentação Swagger

### 1. **Abrir Swagger UI**
```bash
npm run dev
# Abra: http://localhost:3000/api-docs
```

### 2. **Explorar Endpoints**
Todos os endpoints estão documentados com:
- ✅ Descrição detalhada
- ✅ Parâmetros de entrada
- ✅ Formatos esperados
- ✅ Respostas de sucesso e erro
- ✅ Exemplos reais

### 3. **Testar Endpoints**

#### Sem Autenticação (Public):
```bash
# Listar produtos
GET /api/products

# Obter produto específico
GET /api/products/{id}
```

#### Com Autenticação (Protected):

**Passo 1: Registrar Usuário Admin**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@catalog.com",
  "password": "admin123",
  "role": "admin"
}
```

**Passo 2: Fazer Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@catalog.com",
  "password": "admin123"
}

# Resposta inclui token:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

**Passo 3: Usar Token no Swagger**

1. Clique no botão "Authorize" (🔒) no topo direito do Swagger
2. Cole o token sem "Bearer " (o Swagger adiciona automaticamente)
3. Clique "Authorize"
4. Agora pode testar endpoints protegidos!

**Passo 4: Testar Endpoints Protegidos**
```bash
POST /api/products (Admin only)
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "name": "Notebook Dell",
  "description": "High-performance laptop",
  "price": 2999.99,
  "category": "eletrônicos",
  "sku": "DELL-NB-001",
  "stock": 10
}
```

---

## 📊 Estrutura da API

### 🔐 Autenticação

#### POST /api/auth/register
- **Descrição**: Registrar novo usuário
- **Acesso**: Público
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string (min 6 chars)",
    "role": "user|admin" (default: user)
  }
  ```
- **Resposta (201)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "createdAt": "2025-12-07T04:00:00Z"
    }
  }
  ```

#### POST /api/auth/login
- **Descrição**: Fazer login e obter JWT token
- **Acesso**: Público
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Resposta (200)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  }
  ```

---

### 📦 Produtos

#### GET /api/products
- **Descrição**: Listar todos os produtos com paginação
- **Acesso**: Público
- **Query Parameters**:
  - `page` (int): Número da página (default: 1)
  - `limit` (int): Items por página (default: 10)
  - `category` (string): Filtrar por categoria
  - `minPrice` (number): Preço mínimo
  - `maxPrice` (number): Preço máximo
  - `search` (string): Buscar em nome/descrição

- **Exemplos de Query**:
  ```bash
  # Página 1, 10 items
  GET /api/products?page=1&limit=10

  # Filtrar por categoria
  GET /api/products?category=eletrônicos

  # Filtrar por preço
  GET /api/products?minPrice=100&maxPrice=5000

  # Buscar produto
  GET /api/products?search=notebook

  # Combinar filtros
  GET /api/products?page=1&limit=20&category=eletrônicos&minPrice=1000
  ```

- **Resposta (200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": 2999.99,
        "category": "string",
        "sku": "string",
        "stock": 10,
        "createdAt": "2025-12-07T04:00:00Z",
        "updatedAt": "2025-12-07T04:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
  ```

#### GET /api/products/{id}
- **Descrição**: Obter detalhes de um produto
- **Acesso**: Público
- **Path Parameters**:
  - `id` (string, required): MongoDB ObjectId do produto

- **Resposta (200)**:
  ```json
  {
    "success": true,
    "data": {...product}
  }
  ```

#### POST /api/products
- **Descrição**: Criar novo produto
- **Acesso**: Admin only (requer autenticação)
- **Headers**:
  ```
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json
  ```
- **Body** (required fields: name, price, category, sku):
  ```json
  {
    "name": "Notebook Dell",
    "description": "High-performance laptop with Intel i5",
    "price": 2999.99,
    "category": "eletrônicos",
    "sku": "DELL-NB-001",
    "stock": 10
  }
  ```

- **Resposta (201)**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {...product_created}
  }
  ```

#### PUT /api/products/{id}
- **Descrição**: Atualizar um produto
- **Acesso**: Admin only (requer autenticação)
- **Path Parameters**:
  - `id` (string, required): MongoDB ObjectId

- **Body** (todos os campos opcionais):
  ```json
  {
    "name": "Notebook Dell XPS",
    "price": 3299.99,
    "stock": 15
  }
  ```

- **Resposta (200)**:
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": {...product_updated}
  }
  ```

#### DELETE /api/products/{id}
- **Descrição**: Deletar um produto
- **Acesso**: Admin only (requer autenticação)
- **Path Parameters**:
  - `id` (string, required): MongoDB ObjectId

- **Resposta (200)**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

## 🔒 Segurança

### Autenticação JWT
- Todos os endpoints protegidos requerem token JWT no header `Authorization`
- Formato: `Authorization: Bearer {token}`
- Tokens expiram em 24 horas (configurável em `.env`)

### Roles
- **user**: Acesso apenas leitura
- **admin**: Acesso completo (CRUD)

### Validações
- ✅ Validação de email (formato)
- ✅ Validação de senha (min 6 caracteres)
- ✅ Validação de SKU (padrão: `^[A-Z0-9-]{5,20}$`)
- ✅ Validação de preço (mínimo 0)
- ✅ Validação de stock (mínimo 0)

---

## 🐛 Códigos de Erro

| Código | Descrição |
|--------|----------|
| **200** | OK - Requisição bem sucedida |
| **201** | Created - Recurso criado com sucesso |
| **400** | Bad Request - Dados inválidos |
| **401** | Unauthorized - Token faltando ou inválido |
| **403** | Forbidden - Permissão insuficiente (role) |
| **404** | Not Found - Recurso não encontrado |
| **409** | Conflict - Email ou SKU já existe |
| **500** | Server Error - Erro interno do servidor |

---

## 📡 Exemplo de Fluxo Completo

### 1️⃣ Registrar usuário admin
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

### 2️⃣ Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@catalog.com",
    "password": "admin123"
  }'
```

### 3️⃣ Copiar token da resposta e criar produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Notebook Dell",
    "description": "High-performance laptop",
    "price": 2999.99,
    "category": "eletrônicos",
    "sku": "DELL-NB-001",
    "stock": 10
  }'
```

### 4️⃣ Listar produtos
```bash
curl http://localhost:3000/api/products?page=1&limit=10
```

---

## 📖 Recursos Adicionais

- **Especificação OpenAPI**: http://localhost:3000/openapi.json
- **Swagger UI**: http://localhost:3000/api-docs
- **GitHub Repository**: https://github.com/Tercio01/desafio-tecnico-catalog-api
- **OpenAPI Official**: https://spec.openapis.org/oas/v3.0.0

---

## ✅ Status da Documentação

- ✅ OpenAPI 3.0.0 implementado
- ✅ Swagger UI integrado
- ✅ Todos os endpoints documentados
- ✅ Modelos (schemas) definidos
- ✅ Exemplos de requisição/resposta
- ✅ Descrições de segurança e autenticação
- ✅ Códigos de erro documentados

---

**Última atualização**: 07 de Dezembro de 2025
**Versão da API**: 1.0.0
