import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },  // Ramp-up: 1 usuário
    { duration: '20s', target: 5 },  // Ramp-up: 5 usuários
    { duration: '30s', target: 10 }, // Ramp-up: 10 usuários
    { duration: '30s', target: 10 }, // Hold: 10 usuários
    { duration: '10s', target: 0 },  // Ramp-down: 0 usuários
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'], // erro rate < 10%
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test 1: GET /api/products - Should be rate limited at 50 req/15min
  const productRes = http.get(`${BASE_URL}/api/products`);
  
  check(productRes, {
    'GET /api/products - Status 200 or 429': (r) => r.status === 200 || r.status === 429,
    'GET /api/products - Has RateLimit headers': (r) => 
      r.headers['RateLimit-Limit'] || r.headers['X-RateLimit-Limit'],
  });

  // Log rate limit info
  if (productRes.status === 429) {
    console.log(`⚠️  Rate limit hit! Status: ${productRes.status}`);
    console.log(`   Retry-After: ${productRes.headers['Retry-After']}`);
  } else {
    console.log(`✅ Request successful. RateLimit-Remaining: ${productRes.headers['RateLimit-Remaining']}`);
  }

  sleep(0.5);
}
