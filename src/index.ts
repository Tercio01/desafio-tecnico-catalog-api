import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar Swagger
setupSwagger(app);

// ===== ROTAS PÚBLICAS =====
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

console.log('✅ CRUD com autenticação configurado');

// ===== OUTRAS ROTAS =====
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Catálogo de Produtos - Com Autenticação JWT e Swagger!',
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: 'GET /api-docs',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      products: {
        public: {
          list: 'GET /api/products',
          get: 'GET /api/products/:id'
        },
        protected: {
          create: 'POST /api/products (Auth)',
          update: 'PUT /api/products/:id (Auth)',
          delete: 'DELETE /api/products/:id (Auth)'
        }
      },
      health: 'GET /health'
    }
  });
});

// Exportar app para testes
export default app;

// Iniciar servidor apenas se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API com Autenticação JWT e Swagger rodando na porta ${PORT}`);
    console.log('📍 Endpoints:');
    console.log('   📚 Docs: http://localhost:3000/api-docs');
    console.log('   🔐 Auth:');
    console.log('      POST /api/auth/register');
    console.log('      POST /api/auth/login');
    console.log('      GET  /api/auth/me');
    console.log('   📦 Products:');
    console.log('      GET    /api/products (Public)');
    console.log('      POST   /api/products (Auth)');
    console.log('      GET    /api/products/:id (Public)');
    console.log('      PUT    /api/products/:id (Auth)');
    console.log('      DELETE /api/products/:id (Auth)');
  });
}
