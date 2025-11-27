import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalogdb';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    logger.error({ err: error }, '❌ Erro ao conectar ao MongoDB');
    process.exit(1);
  }
};

export default connectDB;
