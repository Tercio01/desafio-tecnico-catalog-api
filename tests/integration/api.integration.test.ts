import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';
import User from '../../src/models/User';
import Product from '../../src/models/Product';

describe('API Integration Tests', () => {
  let authToken: string;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/catalog-test');
    }
    await User.deleteMany({});
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Authentication', () => {
    it('POST /api/v1/auth/register - should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
          role: 'user',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      authToken = response.body.data.token;
      userId = response.body.data.user.id;
    });

    it('POST /api/v1/auth/login - should login user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('GET /api/v1/auth/me - should get current user', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@example.com');
    });
  });

  describe('Products', () => {
    it('POST /api/v1/products - should create a product', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 99.99,
          quantity: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('Test Product');
      productId = response.body.data.id;
    });

    it('GET /api/v1/products - should list products', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
