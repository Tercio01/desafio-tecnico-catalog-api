import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,           // 50 usuários virtuais
  duration: '30s',   // 30 segundos
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% das requisições < 500ms
    http_req_failed: ['rate<0.1'],     // Menos de 10% de falhas
  },
};

export default function () {
  // GET /api/v1/products (deve usar cache após primeira chamada)
  let res = http.get('http://localhost:3000/api/v1/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(0.5);
}
