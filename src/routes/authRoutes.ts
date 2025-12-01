import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

console.log('[DEBUG-AUTH] Router criado');

// Rotas de autenticação
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

console.log('[DEBUG-AUTH] Rotas registradas');

export default router;
