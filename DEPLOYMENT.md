# 🚀 Deployment Guide

## Table of Contents
- [Quick Start](#quick-start)
- [Node.js Compatibility](#nodejs-compatibility)
- [Local Deployment](#local-deployment)
- [Docker Deployment (Recommended)](#docker-deployment-recommended)
- [Environment Variables](#environment-variables)
- [Health Checks](#health-checks)
- [Monitoring & Logging](#monitoring--logging)
- [Production Considerations](#production-considerations)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Using Docker (Recommended - 2 minutes)

```bash
# Clone repository
git clone https://github.com/Tercio01/desafio-tecnico-catalog-api.git
cd desafio-tecnico-catalog-api

# Start all services
docker-compose up --build

# Verify API is running
curl http://localhost:3000/health
```

### Local Development (5 minutes)

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start MongoDB (if not using Docker)
sudo systemctl start mongod

# Run in development mode
npm run dev
```

---

## Node.js Compatibility

### Tested Versions

| Version | Status | Notes |
|---------|--------|-------|
| 22.x | ✅ Recommended | Latest LTS, no warnings |
| 20.x | ✅ Supported | Stable, tested |
| 18.x | ⚠️ Compatible | Non-critical warnings (see below) |

### Known Issues

**Node.js 18.x** may show `EBADENGINE` warnings for:
- `mongodb@7.0.0+`
- `mongoose@9.0+`

**Why?** These packages expect Node 20+, but application runs perfectly on 18.x.

**Solution:** Either upgrade Node.js or ignore warnings (they're non-critical).

---

## Local Deployment

### Prerequisites

```bash
# Check Node.js
node --version  # Should be 18.x or higher

# Check npm
npm --version   # Should be 8.x or higher

# Check MongoDB (if running locally)
mongod --version
```

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd desafio-tecnico-catalog-api

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Ensure MongoDB is running
sudo systemctl start mongod
# Or use Docker: docker run -d -p 27017:27017 mongo:8

# 5. Run application
npm run dev
# API will be available at http://localhost:3000
```

### Verification

```bash
# Check API is responding
curl http://localhost:3000/health

# Should return:
# {"success":true,"status":"OK","rateLimitingStatus":"active"}
```

---

## Docker Deployment (Recommended)

### Architecture

```yaml
Services:
  - MongoDB (port 27017)  # Database
  - Redis (port 6379)     # Cache & Rate Limiting
  - API (port 3000)       # Node.js Application
```

### Docker Compose Setup

```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Remove volumes (clean state)
docker-compose down -v
```

### Docker Build Optimization

The Dockerfile uses **multi-stage builds** for optimization:

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "start"]
```

**Benefits:**
- ✅ Smaller final image (~150MB instead of 400MB)
- ✅ No build tools in production
- ✅ Faster deployment

---

## Environment Variables

### Required Variables

```bash
# Server Configuration
PORT=3000                          # API port
NODE_ENV=production                # Environment

# Database
MONGODB_URI=mongodb://mongo:27017/catalog  # MongoDB connection

# Authentication
JWT_SECRET=your-super-secret-key   # JWT signing key (CHANGE THIS!)
JWT_EXPIRE=24h                     # Token expiration

# Cache
REDIS_URL=redis://redis:6379       # Redis connection
```

### Optional Variables

```bash
# Logging
LOG_LEVEL=info                     # Log level

# Monitoring
MONITORING_ENABLED=true            # Enable monitoring
METRICS_PORT=9090                  # Metrics endpoint
```

### Security Best Practices

✅ **DO:**
- Use `.env` file for secrets (not in code)
- Use strong JWT_SECRET (minimum 32 characters)
- Rotate secrets regularly
- Use environment-specific configs

❌ **DON'T:**
- Commit `.env` to Git
- Use weak secrets
- Share secrets in logs
- Use same secret for all environments

---

## Health Checks

### Health Endpoint

```bash
# Check API health
curl http://localhost:3000/health
```

### Expected Response

```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2025-12-08T22:30:00Z",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected",
  "rateLimitingStatus": "active"
}
```

### Docker Health Check

Configured in `docker-compose.yml`:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**What this means:**
- ✅ Docker tests health every 30 seconds
- ❌ After 3 failed tests, container is marked unhealthy
- ⏰ Waits 40s before first check (startup time)

---

## Monitoring & Logging

### Application Logs

```bash
# View real-time logs (Docker)
docker-compose logs -f api

# View logs for specific service
docker-compose logs mongodb
docker-compose logs redis

# Save logs to file
docker-compose logs > logs.txt
```

### Log Levels

```
DEBUG   - Detailed information for debugging
INFO    - General informational messages
WARN    - Warning messages
ERROR   - Error messages
```

### Structured Logging

The API uses structured logging:

```json
{
  "timestamp": "2025-12-08T22:30:00Z",
  "level": "info",
  "requestId": "abc123",
  "path": "/api/products",
  "method": "GET",
  "statusCode": 200,
  "duration": 5.82,
  "message": "Product list retrieved"
}
```

---

## Production Considerations

### Security

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Use this in your .env file
JWT_SECRET=<generated-secret>
```

### Database

```bash
# Backup database
docker exec mongodb mongodump --out /backup

# Restore database
docker exec mongodb mongorestore /backup
```

### Rate Limiting

**Current limits (configurable):**
- Global: 100 requests/15 minutes
- Auth: 5 failures/15 minutes
- API: 50 requests/15 minutes
- Write: 20 requests/15 minutes

**To modify:** Edit `src/middleware/rateLimiter.ts`

### Auto-Scaling

For AWS ECS or Kubernetes:

```yaml
# Scale based on CPU usage
targetCPUUtilization: 70%
minReplicas: 2
maxReplicas: 10
```

---

## Troubleshooting

### API Not Starting

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :27017
lsof -i :6379

# Kill process using port
kill -9 <PID>
```

### MongoDB Connection Error

```bash
# Verify MongoDB is running
docker-compose ps

# Check connection string in .env
echo $MONGODB_URI

# Test connection
docker exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Redis Connection Error

```bash
# Check Redis is running
docker-compose ps

# Test Redis connection
docker exec redis redis-cli ping
# Should return: PONG
```

### JWT Token Invalid

```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Generate new token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### High Memory Usage

```bash
# Check Docker resource usage
docker stats

# Limit container resources
docker update --memory="512m" <container-id>
```

### Slow Queries

```bash
# Enable query logging in MongoDB
docker exec mongodb mongosh
> db.setProfilingLevel(1, { slowms: 100 })

# View slow queries
> db.system.profile.find({ millis: { $gt: 100 } }).pretty()
```

---

## Performance Optimization

### Database Optimization

```bash
# Create indexes
docker exec mongodb mongosh <<EOF
db.products.createIndex({ "name": 1 })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "sku": 1 }, { unique: true })
EOF
```

### Caching Strategy

- **Products list**: Cache 1 hour
- **Single product**: Cache 30 minutes
- **User data**: Cache 5 minutes

### Load Testing

```bash
# Run k6 load test
k6 run k6-load-test.js

# With custom settings
k6 run -u 50 -d 5m k6-load-test.js
# (50 users for 5 minutes)
```

---

## Rollback Strategy

### If Deployment Fails

```bash
# View deployment history
docker image ls

# Rollback to previous version
docker-compose down
git checkout <previous-commit>
docker-compose up --build
```

### Using Version Tags

```bash
# Build with version tag
docker build -t catalog-api:v1.0.0 .

# Push to registry
docker push your-registry/catalog-api:v1.0.0

# Rollback by pulling old version
docker pull your-registry/catalog-api:v0.9.0
```

---

## Cloud Deployment (AWS)

### ECS (Elastic Container Service)

1. Push image to ECR
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
docker tag catalog-api:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/catalog-api:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/catalog-api:latest
```

2. Create ECS task definition
3. Create ECS service with load balancer
4. Configure auto-scaling

### RDS (Managed Database)

```bash
# Connection string for RDS MongoDB (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catalog
```

### ElastiCache (Managed Redis)

```bash
# Connection string for ElastiCache
REDIS_URL=redis://your-cluster.abc123.ng.0001.use1.cache.amazonaws.com:6379
```

---

## Maintenance

### Regular Tasks

| Task | Frequency | Command |
|------|-----------|----------|
| Check logs | Daily | `docker-compose logs` |
| Backup database | Daily | `docker exec mongodb mongodump` |
| Update dependencies | Weekly | `npm update` |
| Security scan | Weekly | `npm audit` |
| Performance review | Monthly | Review metrics |
| Full backup | Monthly | Archive database |

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Rebuild and test
npm run build
npm test

# Restart services
docker-compose down
docker-compose up --build
```

---

## Support & Documentation

- 📚 Full README: [README.md](README.md)
- 🔐 Security Guide: [SECURITY.md](SECURITY.md)
- 📖 API Docs: [docs/SWAGGER_DOCUMENTATION.md](docs/SWAGGER_DOCUMENTATION.md)
- 🏗️ Architecture: [docs/ARCHITECTURE-AWS.md](docs/ARCHITECTURE-AWS.md)
- ⚡ Rate Limiting: [docs/RATE_LIMITING.md](docs/RATE_LIMITING.md)

---

**Last Updated:** December 8, 2025  
**Maintained by:** Tercio Alves Parente
