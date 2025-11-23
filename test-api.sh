#!/bin/bash

# Script de teste automatizado da API
# Este script testa todos os endpoints principais da API

set -e

API_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Teste Automatizado da API${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Verificar se a API está rodando
echo -e "${YELLOW}[1/8]${NC} Verificando se a API está rodando..."
if curl -s "${API_URL}/health" > /dev/null; then
    echo -e "${GREEN}✓ API está rodando${NC}"
else
    echo -e "${RED}✗ API não está respondendo. Execute 'docker-compose up' primeiro.${NC}"
    exit 1
fi
echo ""

# Teste 1: Health Check
echo -e "${YELLOW}[2/8]${NC} Testando Health Check..."
HEALTH=$(curl -s "${API_URL}/health")
if echo "$HEALTH" | grep -q "OK"; then
    echo -e "${GREEN}✓ Health check passou${NC}"
else
    echo -e "${RED}✗ Health check falhou${NC}"
    exit 1
fi
echo ""

# Teste 2: Registrar usuário admin
echo -e "${YELLOW}[3/8]${NC} Registrando usuário admin..."
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Test",
    "email": "admin.test@catalog.com",
    "password": "admin123",
    "role": "admin"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Usuário registrado com sucesso${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${YELLOW}⚠ Usuário já existe (pode ter sido criado em teste anterior)${NC}"
    # Tentar fazer login
    LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "admin.test@catalog.com",
        "password": "admin123"
      }')
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi
echo ""

# Teste 3: Login
echo -e "${YELLOW}[4/8]${NC} Testando login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.test@catalog.com",
    "password": "admin123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Login realizado com sucesso${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Login falhou${NC}"
    exit 1
fi
echo ""

# Teste 4: Criar produto
echo -e "${YELLOW}[5/8]${NC} Criando produto..."
CREATE_RESPONSE=$(curl -s -X POST "${API_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição do produto teste",
    "price": 99.99,
    "category": "eletrônicos",
    "sku": "TEST-PROD-001",
    "stock": 10
  }')

if echo "$CREATE_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Produto criado com sucesso${NC}"
    PRODUCT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Falha ao criar produto${NC}"
    echo "$CREATE_RESPONSE"
    exit 1
fi
echo ""

# Teste 5: Listar produtos
echo -e "${YELLOW}[6/8]${NC} Listando produtos..."
LIST_RESPONSE=$(curl -s "${API_URL}/api/products")
if echo "$LIST_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Produtos listados com sucesso${NC}"
else
    echo -e "${RED}✗ Falha ao listar produtos${NC}"
    exit 1
fi
echo ""

# Teste 6: Buscar produto por ID
echo -e "${YELLOW}[7/8]${NC} Buscando produto por ID..."
GET_RESPONSE=$(curl -s "${API_URL}/api/products/${PRODUCT_ID}")
if echo "$GET_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Produto encontrado${NC}"
else
    echo -e "${RED}✗ Falha ao buscar produto${NC}"
    exit 1
fi
echo ""

# Teste 7: Atualizar produto
echo -e "${YELLOW}[8/8]${NC} Atualizando produto..."
UPDATE_RESPONSE=$(curl -s -X PUT "${API_URL}/api/products/${PRODUCT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "price": 79.99
  }')

if echo "$UPDATE_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Produto atualizado com sucesso${NC}"
else
    echo -e "${RED}✗ Falha ao atualizar produto${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Todos os testes passaram!${NC}"
echo -e "${GREEN}========================================${NC}"
