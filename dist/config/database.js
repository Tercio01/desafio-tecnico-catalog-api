"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', false);
const connectDB = async () => {
    try {
        console.log('🔄 Tentando conectar ao MongoDB...');
        console.log(`📡 URI: ${process.env.MONGODB_URI}`);
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.log('💡 Verifique se o MongoDB está rodando: docker-compose ps');
        process.exit(1);
    }
};
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});
exports.default = connectDB;
//# sourceMappingURL=database.js.map