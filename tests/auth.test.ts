import request from 'supertest';
import app from '../src/index';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'admin',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User 2',
          email: 'duplicate@example.com',
          password: 'password123',
          role: 'user',
        });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User 2',
          email: 'duplicate@example.com',
          password: 'password123',
          role: 'user',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Login User',
          email: 'login@example.com',
          password: 'password123',
          role: 'user',
        });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('login@example.com');
    });

    it('should reject invalid password', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Invalid Password User',
          email: 'invalidpass@example.com',
          password: 'password123',
          role: 'user',
        });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalidpass@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
