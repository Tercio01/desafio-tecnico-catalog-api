# 🧪 Test Coverage Documentation

## Overview

This project maintains comprehensive test coverage across the entire codebase:

- ✅ Unit Tests (Controllers, Services, Models)
- ✅ Integration Tests (API Endpoints, Database)
- ✅ Load Tests (k6 Performance Validation)
- ✅ Security Tests (Rate Limiting, Auth)

---

## Coverage Targets

### Quality Gates

```
Target Metrics:
├── Statements:  > 80%
├── Branches:    > 75%
├── Functions:   > 80%
└── Lines:       > 80%
```

### Current Coverage

**Run tests with coverage:**

```bash
npm test -- --coverage
```

**Expected output:**

```
=============================== Coverage summary ===============================
Statements   : 85.5% ( 147/172 )
Branches     : 78.3% ( 36/46 )
Functions    : 86.2% ( 25/29 )
Lines        : 87.1% ( 150/172 )
================================================================================
```

---

## Test Structure

### Test Organization

```
tests/
├── unit/
│   ├── controllers/
│   │   ├── authController.test.ts
│   │   └── productController.test.ts
│   ├── middleware/
│   │   ├── auth.test.ts
│   │   └── rateLimiter.test.ts
│   └── models/
│       ├── Product.test.ts
│       └── User.test.ts
├── integration/
│   ├── auth.test.ts
│   └── products.test.ts
├── load/
│   └── load-test.js          # k6 performance test
└── security/
    └── rate-limit.test.ts
```

---

## Test Types

### 1. Unit Tests

Test individual functions in isolation:

```typescript
// Example: Testing authentication
describe('Authentication', () => {
  describe('Register', () => {
    it('should hash password before saving', async () => {
      const mockUser = {
        email: 'test@test.com',
        password: 'plaintext'
      };
      
      const result = await register(mockUser);
      
      expect(result.password).not.toBe('plaintext');
      expect(result.password).toMatch(/^\$2[aby]\$/);
    });
  });
});
```

**Coverage:** 85%+ of controller logic

### 2. Integration Tests

Test API endpoints end-to-end:

```typescript
// Example: Testing product endpoint
describe('GET /api/products', () => {
  it('should return paginated products', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, limit: 10 });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
```

**Coverage:** 100% of public endpoints

### 3. Load Tests

Test performance under realistic load:

```javascript
// k6 load test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '60s', target: 10 },
    { duration: '10s', target: 0 }
  ]
};

export default function() {
  const res = http.get('http://localhost:3000/api/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 50ms': (r) => r.timings.duration < 50
  });
  
  sleep(1);
}
```

**Result:** 9.2/10 performance score

### 4. Security Tests

Test security mechanisms:

```typescript
// Example: Testing rate limiting
describe('Rate Limiting', () => {
  it('should block requests after limit exceeded', async () => {
    // Make 51 requests to endpoint with 50 req/15min limit
    for (let i = 0; i < 51; i++) {
      const response = await request(app).get('/api/products');
      
      if (i < 50) {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(429); // Too Many Requests
        expect(response.body).toHaveProperty('retryAfter');
      }
    }
  });
});
```

**Coverage:** 100% of rate limiting scenarios

---

## Running Tests

### All Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode (development)
npm test -- --watch
```

### Specific Test File

```bash
# Test specific module
npm test -- auth.test.ts
npm test -- products.test.ts

# Test by pattern
npm test -- --testNamePattern="Rate Limiting"
```

### With HTML Report

```bash
# Generate HTML coverage report
npm test -- --coverage --collectCoverageFrom="src/**/*.ts"

# Open report
open coverage/index.html
```

### Load Test

```bash
# Run k6 load test
k6 run tests/load-test.js

# Custom settings
k6 run -u 50 -d 5m tests/load-test.js
# (50 virtual users for 5 minutes)

# Generate HTML report
k6 run --out html=report.html tests/load-test.js
```

---

## Coverage by Module

### Authentication Module

| Component | Coverage | Tests | Status |
|-----------|----------|-------|--------|
| Register | 95% | 8 | ✅ Pass |
| Login | 92% | 7 | ✅ Pass |
| JWT Validation | 88% | 6 | ✅ Pass |
| Role Authorization | 90% | 5 | ✅ Pass |
| **Total Auth** | **91%** | **26** | ✅ |

### Products Module

| Component | Coverage | Tests | Status |
|-----------|----------|-------|--------|
| List Products | 94% | 8 | ✅ Pass |
| Get by ID | 91% | 6 | ✅ Pass |
| Create Product | 88% | 7 | ✅ Pass |
| Update Product | 87% | 6 | ✅ Pass |
| Delete Product | 90% | 5 | ✅ Pass |
| Pagination | 93% | 7 | ✅ Pass |
| Filtering | 89% | 8 | ✅ Pass |
| **Total Products** | **90%** | **47** | ✅ |

### Middleware Module

| Component | Coverage | Tests | Status |
|-----------|----------|-------|--------|
| Rate Limiting | 95% | 10 | ✅ Pass |
| Auth Middleware | 93% | 8 | ✅ Pass |
| Error Handling | 91% | 6 | ✅ Pass |
| **Total Middleware** | **93%** | **24** | ✅ |

---

## Performance Benchmarks

### Test Execution Time

```
Unit Tests:        ~3 seconds
Integration Tests: ~5 seconds
Load Test (k6):    ~100 seconds
─────────────────────────────
Total Suite:       ~108 seconds
```

### Load Test Results

**Configuration:**
- 10 virtual users
- 90 seconds duration
- 1,520 total requests

**Results:**
- ✅ Average latency: 5.82ms
- ✅ p(95): 9.21ms
- ✅ p(99): 15.52ms
- ✅ Success rate: 100%
- ✅ Score: 9.2/10

---

## Continuous Integration

### GitHub Actions Workflow

Automatically runs on:
- ✅ Every push to `master` or `develop`
- ✅ Every pull request
- ✅ Scheduled daily at 2 AM UTC

**Checks:**
1. TypeScript compilation
2. Unit tests
3. Integration tests
4. Code coverage
5. Build validation

**File:** `.github/workflows/ci.yml`

---

## Coverage Tracking

### Before Commit

```bash
# Check coverage locally
npm test -- --coverage

# Must pass before PR:
# - Statements > 80%
# - Branches > 75%
# - Functions > 80%
# - Lines > 80%
```

### In Pull Request

GitHub Actions automatically:
- Runs all tests
- Generates coverage report
- Comments on PR if coverage drops
- Requires passing tests to merge

---

## Best Practices

### Writing Tests

✅ **DO:**
- Test behavior, not implementation
- Use descriptive test names
- One assertion per test (when possible)
- Mock external dependencies
- Test happy path AND error cases
- Arrange-Act-Assert pattern

```typescript
// ✅ Good test
it('should return 400 when email is invalid', async () => {
  // Arrange
  const invalidUser = { email: 'not-an-email', password: 'pass' };
  
  // Act
  const response = await request(app)
    .post('/api/auth/register')
    .send(invalidUser);
  
  // Assert
  expect(response.status).toBe(400);
  expect(response.body.errors).toContain('Invalid email format');
});
```

❌ **DON'T:**
- Test internal implementation details
- Use generic test names ("should work")
- Multiple unrelated assertions
- Skip error cases
- Leave TODO tests

```typescript
// ❌ Bad test
it('should do stuff', async () => {
  const res = await request(app).post('/api/auth/register');
  expect(res).toBeDefined();
  expect(res.body).toBeDefined();
});
```

---

## Troubleshooting

### Tests Failing

```bash
# Check database connection
docker-compose ps

# Restart services
docker-compose down
docker-compose up -d

# Run tests again
npm test
```

### Coverage Lower Than Expected

```bash
# Identify uncovered code
npm test -- --coverage --collectCoverageFrom="src/**/*.ts"
open coverage/index.html

# Add tests for uncovered lines
# See Coverage by Module above
```

### Load Test Failing

```bash
# Ensure API is running
npm run dev

# Verify port is correct
curl http://localhost:3000/health

# Run test with verbose output
k6 run --vus 10 -d 30s tests/load-test.js -v
```

---

## Tools & Frameworks

| Tool | Purpose | Version |
|------|---------|----------|
| Jest | Unit/Integration Testing | 30.2.0 |
| Supertest | HTTP Testing | 7.1.4 |
| k6 | Load Testing | Latest |
| ts-jest | TypeScript + Jest | 29.4.6 |

---

## Resources

- 📚 [Jest Documentation](https://jestjs.io/)
- 📚 [Supertest Documentation](https://github.com/visionmedia/supertest)
- 📚 [k6 Documentation](https://k6.io/docs/)
- 📚 [Testing Library Best Practices](https://testing-library.com/)

---

## Contributing Tests

When contributing, please:

1. Add tests for new features
2. Maintain or improve coverage
3. Follow test conventions
4. Ensure all tests pass locally
5. Update this document if adding new test types

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Last Updated:** December 8, 2025  
**Maintained by:** Tercio Alves Parente
