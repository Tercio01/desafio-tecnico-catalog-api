import express from 'express';

const app = express();
const PORT = 3000;

// Middleware BÁSICO
app.use(express.json());

// Rota MÍNIMA de teste
app.get('/api/minimal', (req, res) => {
  console.log('🎯 MINIMAL TS: Rota chamada!');
  res.json({ success: true, message: 'MINIMAL TS WORKS', ts: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor MINIMAL TypeScript na porta ${PORT}`);
  console.log('📍 Teste: curl http://localhost:3000/api/minimal');
});
