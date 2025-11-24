import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Mongoose para evitar warnings
mongoose.set('strictQuery', false);

const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Tentando conectar ao MongoDB...');
    console.log(`📡 URI: ${process.env.MONGODB_URI}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Verifique se o MongoDB está rodando: docker-compose ps');
    process.exit(1);
  }
};

// Eventos de conexão
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

export default connectDB;
