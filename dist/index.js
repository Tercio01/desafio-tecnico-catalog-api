"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const swagger_1 = require("./config/swagger");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, database_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, swagger_1.setupSwagger)(app);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
console.log('✅ CRUD com autenticação configurado');
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
//# sourceMappingURL=index.js.map