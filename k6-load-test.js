import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const getProductsDuration = new Trend('get_products_duration');
const requestCounter = new Counter('total_requests');
const activeVUs = new Gauge('active_vus');

// Test configuration
export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp-up to 5 VUs
    { duration: '30s', target: 10 },  // Ramp-up to 10 VUs
    { duration: '1m', target: 10 },   // Maintain 10 VUs
    { duration: '10s', target: 0 },   // Ramp-down to 0 VUs
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'http_req_failed': ['rate<0.1'],
    'get_products_duration': ['p(95)<400'],
    'errors': ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'test@test.com';
const TEST_USER_PASSWORD = 'senha123456';
let authToken = '';

// Setup: Get auth token
export function setup() {
  console.log('\n=== SETTING UP LOAD TEST ===');
  
  // Login to get token (user already exists)
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  if (loginRes.status === 200) {
    const token = loginRes.json('data.token');
    console.log(`✓ Authentication successful. Token obtained.`);
    return { token };
  } else {
    console.log(`✗ Login failed: ${loginRes.status}`);
    console.log(`Response: ${loginRes.body}`);
    throw new Error(`Failed to authenticate`);
  }
}

export default function (data) {
  const token = data.token;
  activeVUs.add(__VU);

  // Test 1: List all products
  group('GET /api/products - List All', () => {
    const listRes = http.get(
      `${BASE_URL}/api/products?page=1&limit=10`,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        tags: { name: 'ListProducts' }
      }
    );

    getProductsDuration.add(listRes.timings.duration);
    requestCounter.add(1);

    const success = check(listRes, {
      'status is 200': (r) => r.status === 200,
      'has data array': (r) => Array.isArray(r.json('data')),
    });

    if (!success) errorRate.add(1);
    sleep(0.5);
  });

  // Test 2: Filter by category
  group('GET /api/products - Filter', () => {
    const filterRes = http.get(
      `${BASE_URL}/api/products?category=eletr%C3%B4nicos&limit=5`,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        tags: { name: 'FilterProducts' }
      }
    );

    getProductsDuration.add(filterRes.timings.duration);
    requestCounter.add(1);

    const success = check(filterRes, {
      'status is 200': (r) => r.status === 200,
      'has data': (r) => r.json('data') !== undefined,
    });

    if (!success) errorRate.add(1);
    sleep(0.5);
  });

  // Test 3: Pagination
  group('GET /api/products - Pagination', () => {
    const pageRes = http.get(
      `${BASE_URL}/api/products?page=2&limit=2`,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        tags: { name: 'Pagination' }
      }
    );

    getProductsDuration.add(pageRes.timings.duration);
    requestCounter.add(1);

    const success = check(pageRes, {
      'status is 200': (r) => r.status === 200,
    });

    if (!success) errorRate.add(1);
    sleep(0.5);
  });

  // Test 4: Price filter
  group('GET /api/products - Price Filter', () => {
    const priceRes = http.get(
      `${BASE_URL}/api/products?minPrice=100&maxPrice=1000&limit=5`,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        tags: { name: 'PriceFilter' }
      }
    );

    getProductsDuration.add(priceRes.timings.duration);
    requestCounter.add(1);

    const success = check(priceRes, {
      'status is 200': (r) => r.status === 200,
      'has data': (r) => r.json('data') !== undefined,
    });

    if (!success) errorRate.add(1);
    sleep(0.5);
  });

  // Test 5: Health check
  group('GET /health - System Health', () => {
    const healthRes = http.get(`${BASE_URL}/health`);

    requestCounter.add(1);

    const success = check(healthRes, {
      'status is 200': (r) => r.status === 200,
      'is ok': (r) => r.json('status') === 'OK',
    });

    if (!success) errorRate.add(1);
    sleep(0.5);
  });

  // Test 6: Sequential rapid requests (stress test)
  group('Stress Test - Rapid Requests', () => {
    for (let i = 1; i <= 3; i++) {
      const rapidRes = http.get(
        `${BASE_URL}/api/products?page=${i}&limit=3`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          tags: { name: 'RapidRequest' }
        }
      );

      getProductsDuration.add(rapidRes.timings.duration);
      requestCounter.add(1);

      const success = check(rapidRes, {
        'status ok': (r) => r.status === 200,
      });

      if (!success) errorRate.add(1);
    }
    sleep(0.5);
  });
}

// Teardown: Print summary
export function teardown() {
  console.log('\n=== LOAD TEST COMPLETED ===\n');
}
