import { Router } from 'express';

const router = Router();

console.log('[DEBUG-AUTH] Router criado');

// Rota de teste direto
router.post('/register', (req, res) => {
  console.log('[DEBUG-AUTH] POST /register chamado!');
  res.json({ success: true, message: 'Rota funcionando!' });
});

router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login funcionando!' });
});

router.get('/me', (req, res) => {
  res.json({ success: true, message: 'Get ME funcionando!' });
});

console.log('[DEBUG-AUTH] Rotas registradas');

export default router;
