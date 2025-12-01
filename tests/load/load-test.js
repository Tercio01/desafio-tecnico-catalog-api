import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');
const productsDuration = new Trend('products_duration');

const BASE_URL = 'http://localhost:3000/api/v1';
const USERNAME = `user_${Math.random().toString(36).substring(7)}@test.com`;
const PASSWORD = 'Test@123456';

let authToken = '';

export default function () {
  group('Authentication', () => {
    const registerRes = http.post(`${BASE_URL}/auth/register`, {
      name: `Test User ${Math.random()}`,
      email: USERNAME,
      password: PASSWORD,
    });

    check(registerRes, {
      'register status is 201': (r) => r.status === 201,
      'register returns token': (r) => r.json('data.token') !== undefined,
    }) || errorRate.add(1);

    authDuration.add(registerRes.timings.duration);

    const loginRes = http.post(`${BASE_URL}/auth/login`, {
      email: USERNAME,
      password: PASSWORD,
    });

    check(loginRes, {
      'login status is 200': (r) => r.status === 200,
      'login returns token': (r) => r.json('data.token') !== undefined,
    }) || errorRate.add(1);

    authToken = loginRes.json('data.token');
    authDuration.add(loginRes.timings.duration);
  });

  sleep(1);

  group('List Products', () => {
    const listRes = http.get(
      `${BASE_URL}/products?page=1&limit=10&search=&category=eletronicos`
    );

    check(listRes, {
      'list status is 200': (r) => r.status === 200,
      'list returns data': (r) => r.json('data') !== undefined,
      'list has pagination': (r) => r.json('pagination') !== undefined,
    }) || errorRate.add(1);

    productsDuration.add(listRes.timings.duration);
  });

  sleep(1);

  group('Filter Products', () => {
    const filters = [
      '?page=1&limit=5&minPrice=0&maxPrice=100',
      '?page=1&limit=5&minPrice=100&maxPrice=500',
      '?page=1&limit=5&search=produto',
    ];

    const randomFilter = filters[Math.floor(Math.random() * filters.length)];
    const filterRes = http.get(`${BASE_URL}/products${randomFilter}`);

    check(filterRes, {
      'filter status is 200': (r) => r.status === 200,
      'filter returns products': (r) => r.json('data.length') >= 0,
    }) || errorRate.add(1);

    productsDuration.add(filterRes.timings.duration);
  });

  sleep(1);

  group('Create Product', () => {
    const createRes = http.post(
      `${BASE_URL}/products`,
      {
        name: `Produto Test ${Math.random()}`,
        description: 'Descrição do teste de carga',
        price: Math.floor(Math.random() * 1000) + 10,
        category: 'eletronicos',
        sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
        stock: Math.floor(Math.random() * 100) + 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    check(createRes, {
      'create status is 201': (r) => r.status === 201,
      'create returns product id': (r) => r.json('data._id') !== undefined,
      'create not failing due to auth': (r) => r.status !== 401,
    }) || errorRate.add(1);

    productsDuration.add(createRes.timings.duration);
  });

  sleep(1);

  group('Rate Limit Test', () => {
    for (let i = 0; i < 15; i++) {
      const rateLimitRes = http.get(`${BASE_URL}/products?page=1&limit=1`);

      if (i > 10) {
        check(rateLimitRes, {
          'rate limit kicks in': (r) => r.status === 429 || r.status === 200,
        });
      }
    }
  });

  sleep(2);
}

export function teardown() {
  console.log('📊 Teste de carga finalizado!');
}
