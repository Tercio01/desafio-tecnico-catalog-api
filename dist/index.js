"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pino_http_1 = __importDefault(require("pino-http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = __importDefault(require("./config/database"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const logger_1 = __importDefault(require("./config/logger"));
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, pino_http_1.default)({ logger: logger_1.default }));
app.get('/', (req, res) => {
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
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Catalog API - Documentação',
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await (0, database_1.default)();
        app.listen(PORT, () => {
            logger_1.default.info(`🚀 Servidor rodando na porta ${PORT}`);
            logger_1.default.info(`📍 URL: http://localhost:${PORT}`);
            logger_1.default.info('📚 Endpoints disponíveis:');
            logger_1.default.info('   - GET  / (Informações da API)');
            logger_1.default.info('   - GET  /health (Health check)');
            logger_1.default.info('   - POST /api/auth/register (Registrar usuário)');
            logger_1.default.info('   - POST /api/auth/login (Login)');
            logger_1.default.info('   - GET  /api/products (Listar produtos)');
            logger_1.default.info('   - POST /api/products (Criar produto - Admin)');
        });
    }
    catch (error) {
        logger_1.default.error({ err: error }, '❌ Erro ao iniciar servidor');
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map