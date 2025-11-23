import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 API Catálogo de Produtos - Funcionando!',
    version: '1.0.0',
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
      console.log(`📚 Endpoints disponíveis:`);
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
