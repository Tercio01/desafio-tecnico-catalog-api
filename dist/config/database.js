"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalogdb';
        await mongoose_1.default.connect(mongoUri);
        logger_1.default.info('✅ MongoDB conectado com sucesso!');
    }
    catch (error) {
        logger_1.default.error({ err: error }, '❌ Erro ao conectar ao MongoDB');
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map