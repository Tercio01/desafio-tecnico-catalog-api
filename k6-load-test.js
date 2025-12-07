import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Configurações de métricas customizadas
const errorRate = new Rate('errors');
const getProductsDuration = new Trend('get_products_duration');
const createProductDuration = new Trend('create_product_duration');
const loginDuration = new Trend('login_duration');
const requestCounter = new Counter('total_requests');
const activeVUs = new Gauge('active_vus');

// Configurações do teste
export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp-up: 5 usuários em 10s
    { duration: '30s', target: 10 },  // Ramp-up: 10 usuários em 30s
    { duration: '1m', target: 10 },   // Mantém 10 usuários por 1 minuto
    { duration: '10s', target: 0 },   // Ramp-down: volta a 0 em 10s
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% das respostas < 500ms, 99% < 1000ms
    'http_req_failed': ['rate<0.1'],                     // Taxa de erro < 10%
    'get_products_duration': ['p(95)<400'],              // GET products < 400ms
    'errors': ['rate<0.05'],                             // Taxa de erro customizada < 5%
  },
  ext: {
    loadimpact: {
      projectID: 3568320,
      name: 'Catalog API Load Test'
    }
  }
};

const BASE_URL = 'http://localhost:3000';
let authToken = '';

export default function () {
  activeVUs.add(__VU); // Rastreia VUs ativos

  // Grupo 1: Autenticação
  group('Auth - Login', () => {
    const loginPayload = {
      email: `user${__VU}@test.com`,
      password: 'senha123456'
    };

    const loginRes = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify(loginPayload),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'Login' }
      }
    );

    loginDuration.add(loginRes.timings.duration);
    requestCounter.add(1);

    // Verifica se login foi bem-sucedido
    const loginSuccess = check(loginRes, {
      'login status is 200': (r) => r.status === 200,
      'login returns token': (r) => r.json('data.token') !== undefined,
    });

    if (loginSuccess && loginRes.json('data.token')) {
      authToken = loginRes.json('data.token');
    } else {
      errorRate.add(1);
    }

    sleep(1);
  });

  // Grupo 2: GET Produtos (sem filtros)
  group('Products - List All', () => {
    const listRes = http.get(
      `${BASE_URL}/api/products?page=1&limit=10`,
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'ListProducts' }
      }
    );

    getProductsDuration.add(listRes.timings.duration);
    requestCounter.add(1);

    const listSuccess = check(listRes, {
      'list status is 200': (r) => r.status === 200,
      'list returns data': (r) => r.json('data.length') > 0,
      'list has pagination': (r) => r.json('pagination.total') !== undefined,
      'pagination has hasNextPage': (r) => r.json('pagination.hasNextPage') !== undefined,
    });

    if (!listSuccess) {
      errorRate.add(1);
    }

    sleep(1);
  });

  // Grupo 3: GET Produtos com filtros
  group('Products - Filter by Category', () => {
    const filterRes = http.get(
      `${BASE_URL}/api/products?category=eletrônicos&page=1&limit=5`,
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'FilterProducts' }
      }
    );

    getProductsDuration.add(filterRes.timings.duration);
    requestCounter.add(1);

    const filterSuccess = check(filterRes, {
      'filter status is 200': (r) => r.status === 200,
      'filter by category works': (r) => r.json('count') >= 0,
    });

    if (!filterSuccess) {
      errorRate.add(1);
    }

    sleep(1);
  });

  // Grupo 4: GET Produtos com paginação (página 2)
  group('Products - Pagination Page 2', () => {
    const pageRes = http.get(
      `${BASE_URL}/api/products?page=2&limit=2`,
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'PaginationPage2' }
      }
    );

    getProductsDuration.add(pageRes.timings.duration);
    requestCounter.add(1);

    const pageSuccess = check(pageRes, {
      'pagination page 2 status is 200': (r) => r.status === 200,
      'pagination page is 2': (r) => r.json('pagination.page') === 2,
      'pagination limit is 2': (r) => r.json('pagination.limit') === 2,
    });

    if (!pageSuccess) {
      errorRate.add(1);
    }

    sleep(1);
  });

  // Grupo 5: GET Produtos com filtro de preço
  group('Products - Price Filter', () => {
    const priceRes = http.get(
      `${BASE_URL}/api/products?minPrice=100&maxPrice=1000`,
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'PriceFilter' }
      }
    );

    getProductsDuration.add(priceRes.timings.duration);
    requestCounter.add(1);

    const priceSuccess = check(priceRes, {
      'price filter status is 200': (r) => r.status === 200,
      'price filter returns data': (r) => r.json('data') !== undefined,
    });

    if (!priceSuccess) {
      errorRate.add(1);
    }

    sleep(1);
  });

  // Grupo 6: Testa comportamento sob requisições rápidas
  group('Rapid Requests - Stress Test', () => {
    for (let i = 0; i < 5; i++) {
      const rapidRes = http.get(
        `${BASE_URL}/api/products?page=${i + 1}&limit=5`,
        {
          headers: { 'Content-Type': 'application/json' },
          tags: { name: 'RapidRequest' }
        }
      );

      getProductsDuration.add(rapidRes.timings.duration);
      requestCounter.add(1);

      const rapidSuccess = check(rapidRes, {
        'rapid request status ok': (r) => r.status === 200,
      });

      if (!rapidSuccess) {
        errorRate.add(1);
      }
    }

    sleep(1);
  });
}

// Função executada ao final do teste
export function teardown() {
  console.log('\n=== LOAD TEST COMPLETED ===');
}
