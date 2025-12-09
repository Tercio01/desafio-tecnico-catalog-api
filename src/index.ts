import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import metricsRoutes from './routes/metricsRoutes';
import specs from './swagger';
import { logger } from './utils/logger';
import { initDatabaseMonitoring } from './utils/databaseMonitoring';
import healthRouter from './routes/health';
import {
  closeRateLimitStore,
  globalLimiter,
  authLimiter,
  apiLimiter,
  createProductLimiter,
} from './middleware/rateLimiter';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app: Application = express();

// Middleware de segurança
app.use(helmet());
app.use(cors());

// Middleware de logging estruturado
app.use((req, res, next) => {
  const requestId = (req.headers['x-request-id'] as string) || Date.now().toString();
  
  logger.setContext({
    requestId,
    endpoint: req.path,
    method: req.method
  });

  const startTime = Date.now();
  
  res.on('finish', () => {
    logger.info('REQUEST_COMPLETE', {
      statusCode: res.statusCode,
      duration: Date.now() - startTime
    });
  });

  next();
});

// Health check route
app.use('/api', healthRouter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();
initDatabaseMonitoring();

// Rate limiting
app.use(globalLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/products', apiLimiter, createProductLimiter, productRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  logger.error('UNHANDLED_ERROR', {
    name: err.name || "Error",
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info('SERVER_STARTED', { port: PORT });
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ API Docs available at http://localhost:${PORT}/api-docs`);
  console.log(`✓ Health check at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM_RECEIVED');
  server.close(async () => {
    await closeRateLimitStore();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT_RECEIVED');
  server.close(async () => {
    await closeRateLimitStore();
    process.exit(0);
  });
});
