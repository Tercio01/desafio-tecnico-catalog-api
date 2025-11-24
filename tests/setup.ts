import mongoose from 'mongoose';

beforeAll(async () => {
  // Usar MongoDB local/Docker em vez de memory server
  const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/catalogdb-test?authSource=admin';
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

beforeEach(async () => {
  // Limpar todas as coleções antes de cada teste
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Desconectar após testes
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
