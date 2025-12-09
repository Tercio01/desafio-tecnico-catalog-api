# 🔐 Credential Rotation Checklist

**Status:** 💨 IN PROGRESS  
**Date Started:** December 9, 2025, 02:38 UTC-3  
**Responsible:** You (Tercio01)  
**Estimated Time:** 30 minutes

---

## 🌟 FASE 1: MongoDB Atlas - Deletar Usuário Antigo

### Passo 1: Acessar MongoDB Atlas
```
[  ] Abra: https://cloud.mongodb.com
[  ] Faça login com sua conta
[  ] Selecione seu projeto/cluster
```

### Passo 2: Ir para Database Access
```
No menu esquerdo, procure por:
[  ] Database Access
[  ] Click em Database Access
```

### Passo 3: Identificar Usuário Antigo
```
Você verá uma lista de usuários. O usuário comprometido é:
[  ] desafio-tecnico-user (ou similar)
[  ] Procure por usuários com a password exposta
[  ] Anote o nome do usuário
```

### Passo 4: Deletar Usuário
```
[  ] Clique nos 3 pontinhos (...) do usuário antigo
[  ] Selecione "Delete User"
[  ] Digite o nome do usuário para confirmar
[  ] Clique "Delete User" novamente
[  ] Aguarde (leva alguns segundos)
```

**✅ Passo 1 Completado?** SIM / NÃO

---

## 🌟 FASE 2: MongoDB Atlas - Criar Novo Usuário

### Passo 1: Clicar em "Add New Database User"
```
Em Database Access:
[  ] Clique no botão verde "Add New Database User"
```

### Passo 2: Preencher Informações
```
[  ] Username: desafio_tecnico_v2
[  ] Password: (clique em "Autogenerate Secure Password")
[  ] Role: Built-in role → Atlas Admin
```

### Passo 3: Copiar Senha Gerada
```
[  ] A senha será mostrada (ex: XyZ123aB456cD789...)
[  ] COPIE A SENHA INTEIRA
[  ] Cole em um editor de texto temporariamente
[  ] Essa será sua senha de database
```

### Passo 4: Confirmar Criação
```
[  ] Clique "Add User"
[  ] Aguarde a criação (leva alguns segundos)
[  ] Novo usuário deve aparecer na lista
```

**✅ Passo 2 Completado?** SIM / NÃO

---

## 🌟 FASE 3: MongoDB Atlas - Obter Connection String

### Passo 1: Ir para Databases
```
No menu esquerdo:
[  ] Clique em "Databases"
[  ] Ou encontre seu cluster
```

### Passo 2: Clicar em "Connect"
```
Próximo do seu cluster:
[  ] Procure por botão "Connect"
[  ] Clique em "Connect"
```

### Passo 3: Selecionar "Connect Your Application"
```
Opções de conexão:
[  ] Clique em "Connect your application"
[  ] NÃO escolha "MongoDB Shell" ou "Compass"
```

### Passo 4: Copiar Connection String
```
Você verá algo como:
 mongodb+srv://desafio_tecnico_v2:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

[  ] COPIE ESSA STRING COMPLETA
[  ] Salve em editor de texto
```

**Formato Final (substitua valores):**
```
MONGODB_URI=mongodb+srv://desafio_tecnico_v2:SENHA_COPIADA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**✅ Passo 3 Completado?** SIM / NÃO

---

## 🌟 FASE 4: Atualizar .env Local

### Passo 1: Criar/Editar arquivo .env
```bash
# No seu terminal, na raiz do projeto:
[  ] cp .env.example .env
# Ou abra .env em seu editor favorito
```

### Passo 2: Atualizar MONGODB_URI
```
Edite a linha:
MONGODB_URI=mongodb://localhost:27017/catalog

Para:
MONGODB_URI=mongodb+srv://desafio_tecnico_v2:SENHA@cluster0.xxxxx.mongodb.net/...

[  ] Substitua SENHA pela senha copiada
[  ] Substitua cluster0.xxxxx.mongodb.net pela sua URL
```

### Passo 3: Atualizar JWT_SECRET (Opcional)
```bash
# Gere uma nova secret (opcional):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

[  ] Copie a saída
[  ] Atualize JWT_SECRET no .env com esse valor
```

### Passo 4: Salvar Arquivo
```
[  ] Salve o arquivo .env
[  ] NÃO comite (está em .gitignore)
```

**✅ Passo 4 Completado?** SIM / NÃO

---

## 🌟 FASE 5: Testar Conexão

### Passo 1: Instalar Dependências
```bash
[  ] npm install
```

### Passo 2: Iniciar Aplicação
```bash
[  ] npm run dev
```

### Passo 3: Verificar Conexão
```
Você deve ver na console:
✅ MongoDB connected successfully
✅ Listening on port 3000
✅ http://localhost:3000

Se houver erro:
[  ] Revisar MONGODB_URI
[  ] Verificar senha (sem espaços extras)
[  ] Verificar se IP está whitelisted no MongoDB Atlas
```

### Passo 4: Testar Endpoints
```
[  ] Abra: http://localhost:3000/api-docs
[  ] Teste GET /api/products
[  ] Deve retornar 200 OK com array vazio ou dados
```

**✅ Passo 5 Completado?** SIM / NÃO

---

## 🌟 FASE 6: GitHub - Fechar Alerta de Segurança

### Passo 1: Acessar Security Alerts
```
[  ] Abra seu repositório no GitHub
[  ] Clique em aba "Security"
[  ] No menu esquerdo, clique "Secret scanning alerts"
```

### Passo 2: Encontrar Alerta MongoDB
```
Você deve ver:
[  ] Alerta: "URI do banco de dados MongoDB Atlas com credenciais"
[  ] Status: Active (vermelho)
[  ] Clique no alerta para abri-lo
```

### Passo 3: Analisar o Alerta
```
O alerta deve mostrar:
[  ] Secret type: mongodb+srv connection string
[  ] Location: File: docs/DEPLOY-ENV.md, Line 509
[  ] Status: Active
[  ] Ou similar
```

### Passo 4: Fechar como "Revoked"
```
[  ] Clique no dropdown ao lado de "Status: Active"
[  ] Selecione "Close as..."
[  ] Selecione "Revoked" (credencial foi trocada)
```

### Passo 5: Adicionar Comentário
```
No campo de comentário, escreva:

Credential rotated successfully.
- Old MongoDB Atlas user deleted
- New user created with strong password
- Connection string updated in .env
- Local connectivity verified
- Incident response documented in SECURITY.md

[  ] Clique "Close alert"
```

### Passo 6: Verificar Alerta Fechado
```
[  ] Página deve mostrar:
   Status: RESOLVED (verde)
   Closed as: Revoked
   Reason: Credential rotated
[  ] Alerta não deve mais aparecer em "Active"
```

**✅ Passo 6 Completado?** SIM / NÃO

---

## 📄 Verificação Final

### Checklist Completo

```
MongoDB Atlas:
[  ] Usuário antigo deletado
[  ] Novo usuário criado
[  ] Senha copiada com segurança
[  ] Connection string obtida

Repositório Local:
[  ] .env atualizado com nova URI
[  ] npm install executado
[  ] npm run dev funcionando
[  ] http://localhost:3000/api-docs acessível
[  ] GET /api/products retorna 200 OK

GitHub:
[  ] Security alert fechado
[  ] Status: "Revoked"
[  ] Comentário explicativo adicionado
[  ] No more active alerts

Documentação:
[  ] SECURITY.md atualizado
[  ] README.md com security badge
[  ] Incident response documented
```

---

## ✅ Conclusão

Quando TODOS os checkboxes acima estiverem marcados:

```
✅ Credenciais rotacionadas com sucesso
✅ Aplicação funcionando com novo usuário
✅ GitHub alert fechado
✅ Documentação completa
✅ Projeto 100% seguro
```

**Status:** 🎉 COMPLETO

---

## 📄 Notas Importantes

### 🔒 Segurança
- ✅ NUNCA compartilhe sua senha do MongoDB
- ✅ NUNCA comite .env com credenciais reais
- ✅ .env está em .gitignore por razão
- ✅ Crie nova senha a cada 90 dias

### 📈 Troubleshooting

**"Erro: Unable to connect to database"**
```
1. Verifique se MONGODB_URI está correto
2. Verifique se a senha não tem caracteres especiais extras
3. Verifique se o IP está whitelisted no MongoDB Atlas
4. Tente copiar a connection string novamente
```

**"Erro: User não existe"**
```
1. Novo usuário foi criado e deletado?
2. Crie novo usuário novamente
3. Espere alguns segundos após criação
```

**"GitHub alert não fecha"**
```
1. Certifique-se de marcar como "Revoked"
2. Aguarde alguns minutos
3. Recarregue a página (F5)
4. Se persistir, abra issue no GitHub
```

---

## 🌐 Para a Entrevista

Despois de completar TUDO acima, você pode dizer:

```
"Quando uma vulnerabilidade foi detectada no GitHub,
respondi profissionalmente com:

1. Credential rotation (MongoDB Atlas)
2. Local environment update
3. Connectivity testing
4. GitHub alert closure
5. Complete documentation
6. Incident response procedures

Tudo foi concluído com sucesso e o projeto
está 100% seguro e pronto para produção."
```

---

**Checklist Version:** 1.0  
**Created:** December 9, 2025, 02:38 UTC-3  
**Status:** Ready for execution
