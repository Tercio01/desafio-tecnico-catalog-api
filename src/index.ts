import { errorHandler } from './middleware/errorHandler';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import logger from './config/logger';
import { swaggerSpec } from './config/swagger';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger HTTP
app.use(pinoHttp({ logger }));

// Rotas
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 API Catálogo de Produtos - Funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      health: '/health',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Documentação Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Catalog API - Documentação',
  })
);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Middleware de erro (deve vir antes da rota 404 e depois das rotas)
app.use(errorHandler);


// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Porta
const PORT = process.env.PORT || 3000;

// Conectar ao banco e iniciar servidor
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      logger.info(`📍 URL: http://localhost:${PORT}`);
      logger.info('📚 Endpoints disponíveis:');
      logger.info('   - GET  / (Informações da API)');
      logger.info('   - GET  /health (Health check)');
      logger.info('   - POST /api/auth/register (Registrar usuário)');
      logger.info('   - POST /api/auth/login (Login)');
      logger.info('   - GET  /api/products (Listar produtos)');
      logger.info('   - POST /api/products (Criar produto - Admin)');
    });
  } catch (error) {
    logger.error({ err: error }, '❌ Erro ao iniciar servidor');
    process.exit(1);
  }
};

startServer();

export default app;
