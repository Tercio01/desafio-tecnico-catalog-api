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
  // 1. REGISTER (novo usuário a cada iteração)
  const registerRes = http.post(
    'http://localhost:3001/api/v1/auth/register',
    JSON.stringify({
      name: `User ${__VU}-${__ITER}`,
      email: `user${__VU}${__ITER}@test.com`,
      password: 'senha123456',
      role: 'user',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const registerToken = registerRes.json('token');

  check(registerRes, {
    'register status 201': (r) => r.status === 201,
    'register has token': () => registerToken !== undefined,
  });

  // 2. LOGIN
  const loginRes = http.post(
    'http://localhost:3001/api/v1/auth/login',
    JSON.stringify({
      email: `user${__VU}${__ITER}@test.com`,
      password: 'senha123456',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const loginToken = loginRes.json('token');

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login has token': () => loginToken !== undefined,
  });

  // 3. GET /auth/me (com token)
  const meRes = http.get('http://localhost:3001/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${loginToken}` },
  });

  check(meRes, {
    'me status 200': (r) => r.status === 200,
  });

  // 4. CREATE PRODUCT (com token)
  const createRes = http.post(
    'http://localhost:3001/api/v1/products',
    JSON.stringify({
      name: `Product ${__VU}-${__ITER}`,
      description: 'Produto de teste',
      price: 100 + __ITER,
      stock: 10,
    }),
    { headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginToken}`,
    } }
  );

  check(createRes, {
    'create product status 201': (r) => r.status === 201,
  });

  // 5. LIST PRODUCTS (sem autenticação, deve funcionar)
  const listRes = http.get('http://localhost:3001/api/v1/products');

  check(listRes, {
    'list products status 200': (r) => r.status === 200,
  });

  sleep(1);
}
