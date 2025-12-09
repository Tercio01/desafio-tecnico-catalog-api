const autocannon = require('autocannon');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const DURATION = process.env.DURATION || 30; // segundos
const CONNECTIONS = process.env.CONNECTIONS || 10;
const PIPELINING = process.env.PIPELINING || 1;

console.log(`
🚀 LOAD TEST CONFIGURATION
==========================
Base URL: ${BASE_URL}
Duration: ${DURATION}s
Connections: ${CONNECTIONS}
Pipelining: ${PIPELINING}
`);

const tests = [
  {
    name: 'Health Check',
    url: `${BASE_URL}/health`,
    method: 'GET',
  },
  {
    name: 'Get Products (No Auth)',
    url: `${BASE_URL}/api/products`,
    method: 'GET',
  },
];

async function runTest(test) {
  console.log(`\n📊 Running: ${test.name}`);
  console.log('='.repeat(50));
  
  const instance = autocannon({
    url: test.url,
    connections: CONNECTIONS,
    pipelining: PIPELINING,
    duration: DURATION,
    method: test.method,
    headers: test.headers || {},
    body: test.body ? JSON.stringify(test.body) : undefined,
  });

  autocannon.track(instance, { renderProgressBar: true });

  return new Promise((resolve) => {
    instance.on('done', (result) => {
      console.log(`\n✅ ${test.name} - Results:`);
      console.log(`   Requests: ${result.requests.total}`);
      console.log(`   Throughput: ${result.throughput.mean} req/s`);
      console.log(`   Latency: ${result.latency.mean}ms (mean)`);
      console.log(`   Errors: ${result.errors}`);
      console.log(`   Timeouts: ${result.timeouts}`);
      console.log(`   2xx: ${result['2xx']}`);
      console.log(`   4xx: ${result['4xx']}`);
      console.log(`   5xx: ${result['5xx']}`);
      resolve(result);
    });
  });
}

async function main() {
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push({ name: test.name, result });
    
    // Pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n\n📈 SUMMARY`);
  console.log('='.repeat(50));
  results.forEach(({ name, result }) => {
    console.log(`${name}:`);
    console.log(`  Total Requests: ${result.requests.total}`);
    console.log(`  Throughput: ${result.throughput.mean.toFixed(2)} req/s`);
    console.log(`  Avg Latency: ${result.latency.mean.toFixed(2)}ms`);
    console.log(`  Errors: ${result.errors}`);
    console.log('');
  });
}

main().catch(console.error);
