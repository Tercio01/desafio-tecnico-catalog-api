import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import logger from './utils/logger';
import { publicApiLimiter } from './middleware/rateLimit';
import { setupSwagger } from './config/swagger';
import { connectRedis, disconnectRedis } from './config/redis';

dotenv.config();

const app = express();

// Documentação Swagger
setupSwagger(app);

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
// ✅ RATE LIMITER REABILITADO
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
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Erro inesperado na aplicação', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor',
    });
  }
);

const PORT = parseInt(process.env.PORT || '3000', 10);

const startServer = async () => {
  try {
    // Conectar ao Redis
    await connectRedis();
    
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      });
    }
  } catch (error) {
    logger.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
