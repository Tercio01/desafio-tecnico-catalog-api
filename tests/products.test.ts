import request from 'supertest';
import app from '../src/index';

let adminToken: string;

describe('Product API', () => {
  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });

    adminToken = loginRes.body.data.token;
  });

  describe('POST /api/v1/products (Create)', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Laptop Dell',
          description: 'High performance laptop',
          price: 1299.99,
          category: 'Eletrônicos',
          sku: 'DELL-001',
          stock: 50,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Laptop Dell');
    });

    it('should reject product without auth', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({
          name: 'Product',
          price: 100,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/products (List)', () => {
    it('should list all products', async () => {
      const res = await request(app)
        .get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/v1/products?category=Eletrônicos');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should filter by price range', async () => {
      const res = await request(app)
        .get('/api/v1/products?minPrice=100&maxPrice=2000');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/products/:id (Get by ID)', () => {
    it('should get product by id', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product GetById',
          description: 'Test',
          price: 300,
          category: 'Eletrônicos',
          sku: 'GETBYID-001',
          stock: 15,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .get(`/api/v1/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Product GetById');
    });

    it('should return 400 for invalid id format', async () => {
      const res = await request(app)
        .get('/api/v1/products/invalid-id-12345');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('ID inválido. Deve ser um ObjectId válido do MongoDB');
    });
  });

  describe('PUT /api/v1/products/:id (Update)', () => {
    it('should update product', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Update',
          description: 'Test',
          price: 250,
          category: 'Eletrônicos',
          sku: 'UPDATE-001',
          stock: 10,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 199.99,
          stock: 5,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject update without auth', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product No Auth',
          description: 'Test',
          price: 200,
          category: 'Eletrônicos',
          sku: 'NOAUTH-001',
          stock: 8,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .send({
          price: 1000,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Delete',
          description: 'Test',
          price: 150,
          category: 'Eletrônicos',
          sku: 'DELETE-001',
          stock: 5,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject delete without auth', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Delete Auth',
          description: 'Test',
          price: 100,
          category: 'Eletrônicos',
          sku: 'DELETE-AUTH-001',
          stock: 5,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/v1/products/${productId}`);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });
});
