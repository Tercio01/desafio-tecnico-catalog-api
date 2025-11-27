# Guia de Contribuição

Obrigado pelo interesse em contribuir para este projeto! 🎉

## Como Contribuir

### 1. Fork e Clone

Fork o repositório no GitHub

git clone https://github.com/seu-usuario/desafio-tecnico-catalog-api.git
cd catalog-api
git remote add upstream https://github.com/Tercio01/desafio-tecnico-catalog-api.git

text

### 2. Crie uma Branch

git checkout -b feature/sua-feature
ou

git checkout -b fix/seu-bug

text

### 3. Faça suas alterações

Siga os padrões de código abaixo:

- ✅ Use TypeScript com strict mode
- ✅ Mantenha a cobertura de testes
- ✅ Siga o ESLint
- ✅ Escreva commits descritivos

### 4. Commit e Push

git add .
git commit -m "feat: descrição da feature"
git push origin feature/sua-feature

text

### 5. Abra um Pull Request

No GitHub, abra um PR descrevendo suas alterações.

---

## 📝 Padrão de Commits

Use Conventional Commits:

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem lógica)
- `refactor:` - Refatoração
- `test:` - Adicionar/atualizar testes
- `chore:` - Dependências/configuração

**Exemplos:**

feat: adicionar endpoint de filtro por categoria
fix: corrigir bug de autenticação JWT
docs: atualizar README com exemplos
test: adicionar testes para validação Zod

text

---

## ✅ Checklist Antes de Fazer Push

- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` passa
- [ ] `npm test` passa
- [ ] Novo código tem testes
- [ ] Commits seguem Conventional Commits
- [ ] Nenhuma console.log deixado

---

## 🧪 Rodando os Testes

Todos os testes

npm test
Modo watch

npm run test:watch
Com coverage

npm run test:coverage

text

---

## 🛠️ Setup Local

npm install
cp .env.example .env
npm run dev

text

API roda em `http://localhost:3000`  
Swagger em `http://localhost:3000/api-docs`

---

## 🐛 Reportar Bugs

Abra uma [Issue](https://github.com/Tercio01/desafio-tecnico-catalog-api/issues) com:

- Descrição clara do bug
- Steps para reproduzir
- Comportamento esperado
- Logs/screenshots

---

## 💡 Sugestões de Melhorias

Abra uma [Discussion](https://github.com/Tercio01/desafio-tecnico-catalog-api/discussions) com suas ideias!

---

## 📄 Código de Conduta

Seja respeitoso e construtivo. Queremos uma comunidade acolhedora!

---

**Obrigado por contribuir!** 🚀
