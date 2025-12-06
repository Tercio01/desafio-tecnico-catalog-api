import request from 'supertest';
import app from '../src/index';

describe('Product API (public + auth)', () => {
  describe('GET /api/v1/products (List all)', () => {
    it(
      'should respond on public list route',
      async () => {
        const res = await request(app).get('/api/v1/products');

        // Aceita qualquer status 2xx
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(300);
      },
      15000, // timeout aumentado para 15s
    );
  });

  describe('Protected routes without auth', () => {
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

    it('should reject update without auth', async () => {
      const res = await request(app)
        .put('/api/v1/products/64b9f5c2f2f2f2f2f2f2f2f2')
        .send({
          name: 'Updated',
        });

      expect(res.status).toBe(401);
    });

    it('should reject delete without auth', async () => {
      const res = await request(app).delete(
        '/api/v1/products/64b9f5c2f2f2f2f2f2f2f2f2',
      );

      expect(res.status).toBe(401);
    });
  });
});
