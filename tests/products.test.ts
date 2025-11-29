import request from 'supertest';
import app from '../src/index';
import Product from '../src/models/Product';

describe('Product API', () => {
  beforeAll(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/v1/products (List all)', () => {
    it('should list all products', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/products (Create)', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Laptop Dell',
          description: 'High-performance laptop',
          price: 1500,
          category: 'eletrônicos', // categoria válida do enum
          sku: 'LAPTOP-001',
          stock: 10,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Laptop Dell');
    });

    it('should reject create without auth', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({
          name: 'Test Product',
          description: 'Test product',
          price: 100,
          category: 'outros',
          sku: 'TEST-001',
          stock: 5,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/products/:id (Get by ID)', () => {
    it('should get product by id', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          description: 'Test',
          price: 100,
          category: 'outros',
          sku: 'TEST-002',
          stock: 5,
        });

      const productId = createRes.body.data._id;

      const res = await request(app).get(`/api/v1/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Product');
    });

    it('should return 400 for invalid product id', async () => {
      const res = await request(app).get('/api/v1/products/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/products/:id (Update)', () => {
    it('should update product', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Original Name',
          description: 'Original',
          price: 100,
          category: 'outros',
          sku: 'TEST-003',
          stock: 5,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Updated Name',
          price: 200,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Name');
    });

    it('should reject update without auth', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          description: 'Test',
          price: 100,
          category: 'outros',
          sku: 'TEST-004',
          stock: 5,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .send({
          name: 'Updated',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'To Delete',
          description: 'Delete me',
          price: 50,
          category: 'outros',
          sku: 'TEST-005',
          stock: 1,
        });

      const productId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', 'Bearer fake-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject delete without auth', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          description: 'Test',
          price: 100,
          category: 'outros',
          sku: 'TEST-006',
          stock: 5,
        });

      const productId = createRes.body.data._id;

      const res = await request(app).delete(`/api/v1/products/${productId}`);

      expect(res.status).toBe(401);
    });
  });
});
