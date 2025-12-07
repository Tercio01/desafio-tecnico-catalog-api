import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import specs from './swagger';
import { closeRateLimitStore } from './middleware/rateLimiter';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app: Application = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚡️ INLINE RATE LIMITING - Test directly in index.ts
interface ClientRequestCount {
  count: number;
  resetTime: number;
}

const clients: { [key: string]: ClientRequestCount } = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 50;

function getClientIP(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  );
}

const simpleRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIP(req);
  const now = Date.now();

  console.log(`🔍 [RATE LIMITER] Middleware execução: IP=${ip}, Path=${req.path}`);

  // Initialize or reset client data
  if (!clients[ip] || now > clients[ip].resetTime) {
    clients[ip] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  // Increment request count
  clients[ip].count++;

  // Set rate limit headers
  const remaining = Math.max(0, MAX_REQUESTS - clients[ip].count);
  const resetTime = new Date(clients[ip].resetTime).toISOString();

  res.setHeader('RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader('RateLimit-Remaining', remaining.toString());
  res.setHeader('RateLimit-Reset', resetTime);

  console.log(`⚡️ [RATE LIMIT] IP: ${ip}, Count: ${clients[ip].count}/${MAX_REQUESTS}, Remaining: ${remaining}`);

  // Check if exceeded
  if (clients[ip].count > MAX_REQUESTS) {
    console.log(`🚫 [RATE LIMIT] BLOQUEADO: IP ${ip} excedeu limite`);
    return res.status(429).json({
      status: 429,
      message: 'Too many requests, please try again later.',
      retryAfter: resetTime,
    });
  }

  next();
};

app.use(simpleRateLimiter);
console.log('✅ Middleware de rate limiting ATIVADO na aplicação');

// ⭐ SWAGGER DEVE VIR ANTES DAS ROTAS 404
// Rota para JSON da especificação OpenAPI
app.get('/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Swagger UI - ANTES das rotas protegidas
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showExtensions: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1
    },
    customCss: `.swagger-ui .topbar { display: none }`,
    customSiteTitle: 'Catalog API - Swagger UI'
  })
);

// Rotas principais
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 API Catálogo de Produtos - Funcionando!',
    version: '1.0.0',
    documentation: 'http://localhost:3000/api-docs',
    openapi: 'http://localhost:3000/openapi.json',
    rateLimiting: {
      enabled: true,
      global: '50 requests per 15 minutes per IP (TEST MODE - DEBUG)',
      auth: '5 failed attempts per 15 minutes',
      api: '50 requests per 15 minutes per IP',
      write: '20 write operations per 15 minutes'
    },
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      health: '/health'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    rateLimitingStatus: 'active'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota 404 - DEVE VIR POR ÚLTIMO
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Porta
const PORT = process.env.PORT || 3000;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🚫 Encerrando servidor...');
  await closeRateLimitStore();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🚫 Encerrando servidor...');
  await closeRateLimitStore();
  process.exit(0);
});

// Conectar ao banco e iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n✅ Servidor rodando na porta ${PORT}`);
      console.log(`📃 URL: http://localhost:${PORT}`);
      console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`🔗 OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
      console.log(`\n⚡️ RATE LIMITING (INLINE - DEBUG):`);
      console.log(`   • Max: 50 req/15min por IP`);
      console.log(`   • Storage: Memory`);
      console.log(`   • Middleware: ATIVO (inline no index.ts)`);
      console.log(`\n🧪 Teste rate limiting:`);
      console.log(`   for i in {1..55}; do curl -s http://localhost:3000/api/products > /dev/null; done`);
      console.log(`\n📋 Endpoints disponíveis:`);
      console.log(`   - GET  /\n   - GET  /health\n   - GET  /api/products\n   - POST /api/products\n`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();