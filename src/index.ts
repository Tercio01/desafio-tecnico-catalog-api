import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import specs from './swagger';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
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
}));

// Rota para JSON da especificação OpenAPI
app.get('/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Rotas
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 API Catálogo de Produtos - Funcionando!',
    version: '1.0.0',
    documentation: 'http://localhost:3000/api-docs',
    openapi: 'http://localhost:3000/openapi.json',
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
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Porta
const PORT = process.env.PORT || 3000;

// Conectar ao banco e iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`🔗 OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
      console.log(`📋 Endpoints disponíveis:`);
      console.log(`   - GET  / (Informações da API)`);
      console.log(`   - GET  /health (Health check)`);
      console.log(`   - POST /api/auth/register (Registrar usuário)`);
      console.log(`   - POST /api/auth/login (Login)`);
      console.log(`   - GET  /api/products (Listar produtos)`);
      console.log(`   - POST /api/products (Criar produto - Admin)`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
