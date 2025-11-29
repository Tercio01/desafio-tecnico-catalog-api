import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import logger from './utils/logger';
import { publicApiLimiter } from './middleware/rateLimit';

dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Conexão com o banco
connectDatabase();

// Rotas públicas básicas
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API de Catálogo de Produtos',
    docs: '/api-docs',
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Rotas versionadas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', publicApiLimiter, productRoutes);

// Middleware de rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Middleware global de erro
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Erro inesperado na aplicação', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor',
    });
  }
);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default app;
