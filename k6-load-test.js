import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Rampa até 5 usuários
    { duration: '20s', target: 10 },  // Mantém 10 usuários
    { duration: '10s', target: 0 },   // Rampa até 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  // GET /health
  const healthRes = http.get('http://localhost:3001/health');
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
  });

  // GET /api/v1/products
  const productsRes = http.get('http://localhost:3001/api/v1/products');
  check(productsRes, {
    'products status 200': (r) => r.status === 200,
    'products has data': (r) => JSON.parse(r.body).data !== undefined,
  });

  // POST /api/v1/auth/register
  const authRes = http.post('http://localhost:3001/api/v1/auth/register', 
    JSON.stringify({
      email: `user${Math.random()}@test.com`,
      password: 'senha123',
      name: 'Test User'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(authRes, {
    'auth status 200': (r) => r.status === 200 || r.status === 409,
  });

  sleep(1);
}
