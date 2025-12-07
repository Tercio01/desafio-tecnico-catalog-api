import mongoose from 'mongoose';

beforeAll(async () => {
  // Conectar ao MongoDB de teste
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalog-test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Limpar dados de teste
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Limpar collections antes de cada teste
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
