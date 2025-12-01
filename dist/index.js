"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const logger_1 = __importDefault(require("./utils/logger"));
const rateLimit_1 = require("./middleware/rateLimit");
const swagger_1 = require("./config/swagger");
const redis_1 = require("./config/redis");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, swagger_1.setupSwagger)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, database_1.default)();
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
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/products', rateLimit_1.publicApiLimiter, productRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    });
});
app.use((err, _req, res, _next) => {
    logger_1.default.error('Erro inesperado na aplicação', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno no servidor',
    });
});
const PORT = parseInt(process.env.PORT || '3000', 10);
const startServer = async () => {
    try {
        await (0, redis_1.connectRedis)();
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                logger_1.default.info(`🚀 Servidor rodando na porta ${PORT}`);
            });
        }
    }
    catch (error) {
        logger_1.default.error('Falha ao iniciar servidor:', error);
        process.exit(1);
    }
};
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
exports.default = app;
//# sourceMappingURL=index.js.map