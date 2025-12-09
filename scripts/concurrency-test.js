const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error('❌ ADMIN_TOKEN environment variable is required');
  process.exit(1);
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

async function testConcurrentWrites() {
  console.log('\n🧪 TEST: Concurrent Product Creation');
  console.log('='.repeat(50));
  
  const promises = [];
  const SKU_BASE = `TEST-${Date.now()}`;
  
  // Tentar criar 10 produtos com SKU similar simultaneamente
  for (let i = 0; i < 10; i++) {
    promises.push(
      axiosInstance.post('/api/products', {
        name: `Concurrent Product ${i}`,
        description: 'Testing race conditions',
        price: 99.99,
        sku: `${SKU_BASE}-${i}`,
        stock: 10,
        category: 'test',
      }).catch(err => ({ error: err.response?.status || err.message }))
    );
  }
  
  const results = await Promise.all(promises);
  
  const successful = results.filter(r => r.status === 201 || r.data?.success).length;
  const failed = results.filter(r => r.error).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${(successful / results.length * 100).toFixed(2)}%`);
  
  return { successful, failed, total: results.length };
}

async function testConcurrentReads() {
  console.log('\n🧪 TEST: Concurrent Product Reads');
  console.log('='.repeat(50));
  
  const promises = [];
  
  // 50 leituras simultâneas
  for (let i = 0; i < 50; i++) {
    promises.push(
      axiosInstance.get('/api/products')
        .then(res => ({ success: true, count: res.data.count }))
        .catch(err => ({ error: err.response?.status || err.message }))
    );
  }
  
  const results = await Promise.all(promises);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => r.error).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${(successful / results.length * 100).toFixed(2)}%`);
  
  return { successful, failed, total: results.length };
}

async function main() {
  console.log(`
🚀 CONCURRENCY TEST
==========================
Base URL: ${BASE_URL}
Token: ${ADMIN_TOKEN ? 'Set ✓' : 'Missing ✗'}
`);
  
  try {
    const writeResults = await testConcurrentWrites();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const readResults = await testConcurrentReads();
    
    console.log(`\n\n📈 SUMMARY`);
    console.log('='.repeat(50));
    console.log(`Concurrent Writes:`);
    console.log(`  Successful: ${writeResults.successful}/${writeResults.total}`);
    console.log(`  Failed: ${writeResults.failed}`);
    console.log('');
    console.log(`Concurrent Reads:`);
    console.log(`  Successful: ${readResults.successful}/${readResults.total}`);
    console.log(`  Failed: ${readResults.failed}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

main();
