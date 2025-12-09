# 📖 Runbook - Catalog API

**Version:** 1.0.0  
**Last Updated:** $(date +%Y-%m-%d)  
**Maintained by:** DevOps Team

---

## 🎯 Quick Reference

### Service Information
- **Name:** Catalog API
- **Port:** 3000
- **Health Check:** `GET /health`
- **Metrics:** `GET /api/metrics/database` (admin only)
- **Documentation:** `/api-docs`

### Key Dependencies
- MongoDB Atlas (Database)
- Node.js v18+
- npm packages (see package.json)

---

## 🚨 Common Incidents & Solutions

### 1. API Not Responding (503 Service Unavailable)

**Symptoms:**
- All endpoints returning 503
- "Service unavailable" messages
- Circuit breaker OPEN state

**Diagnosis:**

Check if server is running

ps aux | grep node
Check logs

tail -100 logs/error.log
Check MongoDB connection

curl http://localhost:3000/health

text

**Resolution:**
1. Check MongoDB connection string in `.env`
2. Verify MongoDB Atlas network access (IP whitelist)
3. Restart the service: `npm run dev`
4. Monitor circuit breaker state in logs

**Prevention:**
- Monitor database connection health
- Set up alerts for circuit breaker state changes

---

### 2. High Latency / Slow Responses

**Symptoms:**
- Response times > 1000ms
- Slow query warnings in logs
- Users reporting timeouts

**Diagnosis:**

Check database metrics

curl -H "Authorization: Bearer <ADMIN_TOKEN>"
http://localhost:3000/api/metrics/database
Check slow queries in logs

grep "SLOW QUERY" logs/all.log
Monitor system resources

top
htop

text

**Resolution:**
1. Identify slow queries from metrics endpoint
2. Add missing database indexes
3. Review and optimize query patterns
4. Consider adding caching layer (Redis)

**Prevention:**
- Monitor average latency
- Set alerts for queries > 100ms
- Regular database performance reviews

---

### 3. Rate Limiting Blocking Legitimate Users

**Symptoms:**
- 429 Too Many Requests errors
- Users unable to access API
- Spike in 4xx errors

**Diagnosis:**

Check recent rate limit hits

grep "429" logs/all.log | tail -20
Check current rate limit config

grep "windowMs|max" src/middleware/rateLimiter.ts

text

**Resolution:**
1. Review rate limiter configuration
2. Temporarily increase limits if necessary
3. Identify if attack or legitimate traffic spike
4. Consider implementing user-based rate limiting

**Configuration:**
- Global: 100 req/15min
- Auth: 5 req/15min
- API: 100 req/15min
- Create Product: 10 req/15min

---

### 4. JWT Token Expired

**Symptoms:**
- 401 Unauthorized errors
- "Token expired" messages
- Users logged out unexpectedly

**Diagnosis:**

Check token expiration time (default: 1 day)

grep "JWT_EXPIRE" .env
Verify token is valid
Use jwt.io to decode token

text

**Resolution:**
1. User needs to login again: `POST /api/auth/login`
2. If frequent expiration, increase `JWT_EXPIRE` in `.env`
3. Consider implementing refresh tokens

---

### 5. Database Connection Lost

**Symptoms:**
- MongoDB connection errors
- "Database unavailable" messages
- Circuit breaker opening frequently

**Diagnosis:**

Check MongoDB connection

curl http://localhost:3000/health
Check logs for connection errors

grep "MongoDB" logs/error.log
Verify .env configuration

cat .env | grep MONGO

text

**Resolution:**
1. Verify MongoDB Atlas cluster is running
2. Check IP whitelist in MongoDB Atlas
3. Verify connection string credentials
4. Restart application to reconnect

**MongoDB Atlas Checks:**
- Cluster status (should be green)
- Network Access (IP whitelist)
- Database Users (credentials valid)

---

## 🔧 Maintenance Procedures

### Daily Checks

1. Check application health

curl http://localhost:3000/health
2. Review error logs

tail -50 logs/error.log
3. Check database metrics

curl -H "Authorization: Bearer <TOKEN>"
http://localhost:3000/api/metrics/database
4. Verify disk space

df -h

text

### Weekly Checks
- Review slow query logs
- Analyze traffic patterns
- Check for security vulnerabilities: `npm audit`
- Update dependencies if needed
- Review and rotate logs

### Monthly Checks
- Performance baseline review
- Database index optimization
- Load testing: `npm run test:load`
- Backup verification
- Documentation updates

---

## 📊 Monitoring Checklist

### Application Metrics
- [ ] Response time < 100ms (p95)
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%
- [ ] Circuit breaker state: CLOSED

### Database Metrics
- [ ] Query latency < 50ms (avg)
- [ ] No slow queries (>100ms)
- [ ] Connection pool healthy
- [ ] No connection leaks

### Infrastructure
- [ ] CPU usage < 70%
- [ ] Memory usage < 80%
- [ ] Disk space > 20% free
- [ ] Network latency < 10ms

---

## 🚀 Deployment Procedures

### Pre-Deployment

1. Run tests

npm test
npm run test:load:short
2. Check dependencies

npm audit
3. Build if needed

npm run build

text

### Deployment

1. Pull latest code

git pull origin main
2. Install dependencies

npm install
3. Run database migrations (if any)
npm run migrate
4. Restart service

npm run dev

text

### Post-Deployment

1. Verify health

curl http://localhost:3000/health
2. Check logs

tail -f logs/all.log
3. Monitor for errors

watch -n 5 'tail -20 logs/error.log'

text

---

## 📞 Escalation Contacts

### L1 Support
- **Team:** Operations
- **Response Time:** 15 minutes
- **Scope:** Basic troubleshooting, restarts

### L2 Support  
- **Team:** Backend Engineering
- **Response Time:** 1 hour
- **Scope:** Code issues, database problems

### L3 Support
- **Team:** Senior Engineering / Architect
- **Response Time:** 4 hours
- **Scope:** Architecture decisions, major incidents

---

## 🔗 Quick Links

- [API Documentation](http://localhost:3000/api-docs)
- [Health Check](http://localhost:3000/health)
- [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
- [GitHub Repository](#)
- [Incident Response Plan](./INCIDENT_RESPONSE.md)
- [Disaster Recovery Plan](./DISASTER_RECOVERY.md)

