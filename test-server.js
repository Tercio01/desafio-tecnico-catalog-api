const express = require('express');
const app = express();
const PORT = 3000;

console.log('🚀 Iniciando servidor TESTE...');

app.get('/api/test', (req, res) => {
  console.log('🎯 ROTA /api/test CHAMADA!');
  res.json({ message: 'TESTE OK' });
});

app.get('/api/products', (req, res) => {
  console.log('🎯 ROTA /api/products CHAMADA!');
  res.json({ message: 'PRODUTOS OK' });
});

app.get('/', (req, res) => {
  res.json({ message: 'ROOT OK' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor TESTE rodando na porta ${PORT}`);
  console.log('📍 Teste: curl http://localhost:3000/api/test');
});
