# 🤛 Contributing Guide

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Quick Start for Contributors](#quick-start-for-contributors)
- [Development Setup](#development-setup)
- [Git Workflow](#git-workflow)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Issue Reporting](#issue-reporting)
- [Performance Guidelines](#performance-guidelines)
- [Helpful Resources](#helpful-resources)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors must adhere to:

- ✅ Be respectful and inclusive
- ✅ Assume good intentions
- ✅ Provide constructive feedback
- ✅ Focus on code, not person
- ✅ Help each other grow

---

## Quick Start for Contributors

### 3 Steps to Contribute

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# 2. Create feature branch
git checkout -b feat/amazing-feature

# 3. Make changes, commit, and push
git push origin feat/amazing-feature

# 4. Open Pull Request
```

---

## Development Setup

### Prerequisites

- Node.js 20+ or 22.x
- npm 8+
- Docker & Docker Compose (recommended)
- Git 2.30+

### Local Environment

```bash
# 1. Clone repository
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Start services (Docker recommended)
docker-compose up

# In another terminal:
# 5. Run development server
npm run dev

# 6. Verify setup
curl http://localhost:3000/health
```

### Editor Configuration

We recommend VS Code with these extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "orta.vscode-jest",
    "ms-azuretools.vscode-docker"
  ]
}
```

---

## Git Workflow

### Branch Naming Convention

Follow this pattern for branch names:

```
<type>/<description>

Types:
  feat/     - New feature
  fix/      - Bug fix
  refactor/ - Code refactoring (no behavior change)
  docs/     - Documentation only
  test/     - Adding/updating tests
  perf/     - Performance improvement
  chore/    - Maintenance tasks
  ci/       - CI/CD configuration
  security/ - Security improvements
```

### Examples

```bash
# Good branch names
git checkout -b feat/add-product-search
git checkout -b fix/rate-limit-bypass
git checkout -b docs/add-deployment-guide
git checkout -b test/increase-coverage
git checkout -b perf/optimize-db-queries

# Bad branch names
git checkout -b new-feature        # ❌ Missing type
git checkout -b fix_bug            # ❌ Underscore instead of slash
git checkout -b UPPERCASE          # ❌ Should be lowercase
```

### Creating a Feature Branch

```bash
# Update main branch
git checkout master
git pull origin master

# Create feature branch
git checkout -b feat/your-feature-name

# Make changes
# ...

# Commit (see Commit Conventions)
# Push
git push origin feat/your-feature-name
```

---

## Commit Conventions

We follow **Conventional Commits** specification for clear commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Components

#### Type (required)
Must be one of:
- **feat** - A new feature
- **fix** - A bug fix
- **refactor** - Code change that neither fixes bug nor adds feature
- **docs** - Documentation only changes
- **test** - Adding missing tests or correcting existing tests
- **perf** - Code change that improves performance
- **chore** - Changes to build process, dependencies, tools
- **ci** - Changes to CI configuration files
- **security** - Security-related changes

#### Scope (optional)
Specify what part of codebase is affected:
- api
- auth
- products
- rate-limit
- database
- docker
- tests
- docs

#### Subject (required)
- Use imperative mood ("add" not "added", "fix" not "fixed")
- Start with lowercase letter
- Do not end with period
- Maximum 50 characters

#### Body (optional)
- Wrap at 72 characters
- Explain **what** and **why**, not **how**
- Separate from subject with blank line

#### Footer (optional)
- Reference issues: `Closes #123` or `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

### Commit Examples

#### Good Commits

```bash
# Simple fix
git commit -m "fix(auth): prevent null pointer in jwt validation"

# Feature with scope
git commit -m "feat(products): add text search functionality"

# With detailed body
git commit -m "feat(rate-limit): implement sliding window algorithm

Implements sliding window rate limiting instead of fixed window.

Reasons:
- More fair distribution of requests
- Better user experience
- Aligns with industry standards

Closes #42"

# Refactoring
git commit -m "refactor(controllers): extract validation logic into middleware"

# Performance improvement
git commit -m "perf(database): add index on product name field

Measurement:
- Before: 50ms average query time
- After: 5ms average query time
- 10x improvement on common queries"

# Breaking change
git commit -m "feat(api)!: change response format for products endpoint

BREAKING CHANGE: GET /api/products now returns paginated response

Old format:
  [{id, name, price}, ...]

New format:
  {data: [...], page: 1, limit: 10, total: 100}"
```

#### Bad Commits

```bash
# ❌ Too vague
git commit -m "Fix stuff"

# ❌ Missing type
git commit -m "Added new feature"

# ❌ Too long subject
git commit -m "feat: add functionality to validate and process incoming requests with proper error handling and logging"

# ❌ Mixing concerns
git commit -m "feat(api): add search AND fix auth AND update docs"
```

### Amending Commits

```bash
# Fix last commit message
git commit --amend --no-edit

# Fix last commit message
git commit --amend -m "new message"

# Add forgotten files
git add forgotten-file.ts
git commit --amend --no-edit

# Careful: only amend if not pushed
# After push, use new commit
git commit -m "fix: correct previous commit message"
```

---

## Pull Request Process

### Before Creating PR

- [ ] Fork the repository
- [ ] Create feature branch from `master`
- [ ] Make changes and commit with conventional commits
- [ ] Run tests: `npm test`
- [ ] Build TypeScript: `npm run build`
- [ ] Check linting: `npm run lint` (if available)
- [ ] Update documentation if needed
- [ ] Test Docker build: `docker build .`

### Creating Pull Request

1. **Push your branch**
```bash
git push origin feat/your-feature
```

2. **Open PR on GitHub**
   - Go to repository
   - Click "Compare & pull request"
   - Fill in the PR template

3. **PR Title Format**
```
feat(scope): description
fix(scope): description
docs(scope): description
```

4. **PR Description Template**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation

## Related Issue
Closes #123

## How to Test
1. Step to reproduce
2. Expected behavior
3. Actual behavior

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review of own code
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings generated
- [ ] Changes are backward compatible
```

### PR Review Process

Maintainers will:
1. Review code for quality and style
2. Verify tests pass
3. Check for breaking changes
4. Request changes if needed
5. Merge when approved

---

## Code Standards

### TypeScript Best Practices

```typescript
// ✅ Good: Explicit types
function calculateTotal(items: Product[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad: Implicit any
function calculateTotal(items: any) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: Interfaces for domain models
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// ❌ Bad: Using any for models
const product: any = { /* ... */ };
```

### Code Organization

```
src/
├── config/       - Configuration files
├── controllers/  - Business logic handlers
├── middleware/   - Express middleware
├── models/       - Database schemas
├── routes/       - API route definitions
├── swagger.ts    - API documentation
└── index.ts      - Entry point
```

### Naming Conventions

```typescript
// Files
productController.ts    // camelCase for regular files
Product.ts              // PascalCase for models/classes
rate-limit.ts           // kebab-case for utilities

// Variables & Functions
const productName: string;     // camelCase
function getProductById() {}    // camelCase
const MAX_RETRIES = 3;         // UPPER_CASE for constants

// Classes & Interfaces
class ProductController {}      // PascalCase
interface IProduct {}           // Interface with I prefix
```

### Error Handling

```typescript
// ✅ Good: Explicit error handling
try {
  await connectToDatabase();
} catch (error) {
  logger.error('Database connection failed', error);
  process.exit(1);
}

// ❌ Bad: Silent failures
await connectToDatabase().catch(() => {});

// ✅ Good: Meaningful error messages
throw new Error('Invalid product ID format');

// ❌ Bad: Generic errors
throw new Error('Error');
```

---

## Testing Requirements

### Test Coverage Targets
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.ts

# Run in watch mode
npm test -- --watch
```

### Test Example

```typescript
// ✅ Good test structure
describe('ProductController', () => {
  describe('getProductById', () => {
    it('should return product when ID is valid', async () => {
      // Arrange
      const productId = 'valid-id';
      const expectedProduct = { id: productId, name: 'Test' };
      jest.spyOn(ProductService, 'findById').mockResolvedValue(expectedProduct);

      // Act
      const result = await ProductController.getProductById(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
    });

    it('should throw when ID is invalid', async () => {
      // Arrange
      const invalidId = 'invalid';

      // Act & Assert
      await expect(
        ProductController.getProductById(invalidId)
      ).rejects.toThrow('Invalid product ID');
    });
  });
});
```

### Before Submitting PR

```bash
# Ensure all tests pass
npm test

# Check test coverage
npm test -- --coverage

# Build TypeScript
npm run build

# Run tests again (be sure!)
npm test
```

---

## Documentation Guidelines

### Adding Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Use sliding window to allow better request distribution
function rateLimit(request: Request): boolean {
  // ...
}

// ❌ Bad: Explain obvious things
// Get the product by ID
function getProductById(id: string): Product {
  // ...
}
```

### JSDoc Format

```typescript
/**
 * Retrieve products with optional filtering and pagination.
 *
 * @param query - Filter and pagination parameters
 * @param query.category - Filter by product category (optional)
 * @param query.page - Page number (default: 1)
 * @param query.limit - Items per page (default: 10)
 * @returns Array of products matching criteria
 * @throws {ValidationError} If parameters are invalid
 * @example
 * const products = await getProducts({ category: 'electronics', page: 1 });
 */
function getProducts(query: ProductQuery): Promise<Product[]> {
  // ...
}
```

### README Sections

If adding feature, update README with:
- Feature description
- Usage example
- Related documentation links
- Any configuration needed

---

## Issue Reporting

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Do this
2. Then that
3. Observe issue

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version: 22.x
- npm version: 10.x
- OS: Ubuntu 22.04
- Docker: Yes/No

## Error Message
```
paste error here
```

## Screenshots
If applicable, add screenshots
```

### Feature Request Template

```markdown
## Description
Clear description of desired feature

## Motivation
Why is this needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches

## Additional Context
Any other relevant information
```

---

## Performance Guidelines

### Database Queries

```typescript
// ✅ Good: Query only needed fields
const product = await Product.findById(id).select('name price category');

// ❌ Bad: Load unnecessary data
const product = await Product.findById(id); // loads all fields
```

### Caching

```typescript
// ✅ Good: Cache expensive operations
const cachedResult = await redis.get(cacheKey);
if (cachedResult) return JSON.parse(cachedResult);

const result = await expensiveOperation();
await redis.setex(cacheKey, 3600, JSON.stringify(result));
return result;
```

### Load Testing

Before submitting major changes:

```bash
# Run load test
k6 run k6-load-test.js

# Should maintain:
# - Average latency < 10ms
# - p95 < 15ms
# - 0% error rate
```

---

## Helpful Resources

### Documentation
- [README.md](README.md) - Project overview
- [docs/SWAGGER_DOCUMENTATION.md](docs/SWAGGER_DOCUMENTATION.md) - API reference
- [docs/ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md) - Architecture details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](SECURITY.md) - Security guidelines

### Learning Resources
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Tools
- [Commitizen](http://commitizen.github.io/) - Commit message helper
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [Prettier](https://prettier.io/) - Code formatter
- [ESLint](https://eslint.org/) - Code linter

---

## Checklist for Contributors

Before submitting PR:

- [ ] Feature branch created from master
- [ ] Branch name follows convention
- [ ] Commits follow conventional commits
- [ ] No console.log() statements left
- [ ] Tests added/updated
- [ ] All tests passing: `npm test`
- [ ] TypeScript builds: `npm run build`
- [ ] Docker builds: `docker build .`
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] No security vulnerabilities
- [ ] Ready for production (or marked as WIP)

---

## Questions?

- Check existing issues/discussions
- Read related documentation
- Open a new discussion
- Reach out to maintainers

---

## Recognition

Contributors will be recognized in:
- CHANGELOG.md
- GitHub Contributors page
- Project documentation

Thank you for contributing! 🙋

---

**Last Updated:** December 8, 2025  
**Maintained by:** Tercio Alves Parente
