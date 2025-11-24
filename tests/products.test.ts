import request from 'supertest';
import app from '../src/index';

let adminToken: string;

describe('Product API', () => {
  beforeAll(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });

    adminToken = loginRes.body.data.token;
  });

  describe('POST /api/products (Create)', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Laptop Dell',
          description: 'High performance laptop',
          price: 1299.99,
          category: 'Eletrônicos',
          sku: 'DELL-001',
          stock: 50
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Laptop Dell');
    });

    it('should reject product without auth', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Product',
          price: 100
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/products (List)', () => {
    it('should list all products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/products?category=Eletrônicos');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should filter by price range', async () => {
      const res = await request(app)
        .get('/api/products?minPrice=100&maxPrice=2000');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/products/:id (Get by ID)', () => {
    it('should get product by id', async () => {
      // Criar um produto primeiro
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product GetById',
          description: 'Test',
          price: 300,
          category: 'Eletrônicos',
          sku: 'GETBYID-001',
          stock: 15
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .get(`/api/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Product GetById');
    });

    it('should return 404 for invalid id', async () => {
      const res = await request(app)
        .get('/api/products/invalid-id-12345');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id (Update)', () => {
    it('should update product', async () => {
      // Criar um produto primeiro
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Update',
          description: 'Test',
          price: 250,
          category: 'Eletrônicos',
          sku: 'UPDATE-001',
          stock: 10
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 199.99,
          stock: 5
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject update without auth', async () => {
      // Criar um produto primeiro
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product No Auth',
          description: 'Test',
          price: 200,
          category: 'Eletrônicos',
          sku: 'NOAUTH-001',
          stock: 8
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({
          price: 1000
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      // Criar um produto primeiro
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Delete',
          description: 'Test',
          price: 150,
          category: 'Eletrônicos',
          sku: 'DELETE-001',
          stock: 5
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject delete without auth', async () => {
      // Criar um produto primeiro
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Delete Auth',
          description: 'Test',
          price: 100,
          category: 'Eletrônicos',
          sku: 'DELETE-AUTH-001',
          stock: 5
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/products/${productId}`);

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
