# 🔍 Troubleshooting Guide

Quick reference for diagnosing and fixing common issues.

---

## 🚦 Quick Diagnostics

### One-Line Health Check

curl -s http://localhost:3000/health | jq .

text

**Expected Output:**

{
"status": "ok",
"timestamp": "2025-12-09T15:43:00.000Z",
"uptime": 12345,
"mongodb": "connected"
}

text

---

## ❌ Common Errors & Solutions

### Error: "EADDRINUSE: address already in use"

**Cause:** Port 3000 is already occupied

**Solution:**

Find process using port 3000

lsof -i :3000
Kill the process

kill -9 <PID>
Or use different port

PORT=3001 npm run dev

text

---

### Error: "MongooseServerSelectionError"

**Cause:** Cannot connect to MongoDB

**Solution:**

1. Check connection string

echo $MONGO_URI
2. Verify MongoDB Atlas is accessible

ping cluster0.xxxxx.mongodb.net
3. Check IP whitelist in MongoDB Atlas
Add 0.0.0.0/0 for testing (not recommended for production)
4. Test connection manually

mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/catalog"

text

---

### Error: "JWT malformed" or "invalid token"

**Cause:** Invalid or expired JWT token

**Solution:**

Get new token

curl -X POST http://localhost:3000/api/auth/login
-H "Content-Type: application/json"
-d '{"email":"admin@example.com","password":"Admin@123456"}'
Verify JWT_SECRET is set

grep JWT_SECRET .env

text

---

### Error: "Too Many Requests (429)"

**Cause:** Rate limiter blocking requests

**Solution:**

Check rate limiter config

grep -A 5 "windowMs|max" src/middleware/rateLimiter.ts
Temporarily disable for testing
Comment out rate limiter in src/index.ts
Or wait for window to reset (15 minutes)

text

---

### Error: "Circuit breaker OPEN"

**Cause:** Too many database errors triggered circuit breaker

**Solution:**

Check circuit breaker logs

grep "Circuit breaker" logs/all.log
Fix underlying database issue
Circuit breaker will auto-recover after 30 seconds
Force restart if needed

npm run dev

text

---

## 🐛 Debugging Commands

### Check Logs

All logs

tail -f logs/all.log
Error logs only

tail -f logs/error.log
Search for specific error

grep "error|Error" logs/all.log | tail -20
Filter by timestamp

grep "2025-12-09 12:" logs/all.log

text

### Database Queries

Get metrics

curl -H "Authorization: Bearer <TOKEN>"
http://localhost:3000/api/metrics/database | jq .
Check slow queries

grep "SLOW QUERY" logs/all.log
Count queries by collection

grep "Products retrieved|Product created" logs/all.log | wc -l

text

### System Resources

CPU and Memory

top -n 1 | head -20
Disk space

df -h
Network connections

netstat -an | grep :3000
Open files

lsof | grep node

text

---

## 🔬 Performance Profiling

### Load Testing

Quick test (10s)

npm run test:load:short
Standard test (30s)

npm run test:load
Heavy test (60s, 50 connections)

npm run test:load:heavy

text

### Memory Leaks

Monitor memory over time

watch -n 5 'ps aux | grep node | grep -v grep'
Node.js heap dump (if memory leak suspected)

kill -USR2 <PID>

text

---

## 📊 Monitoring Commands

### Real-time Monitoring

Watch logs

tail -f logs/all.log
Monitor requests

watch -n 1 'grep REQUEST_COMPLETE logs/all.log | tail -10'
Track error rate

watch -n 5 'grep "error" logs/all.log | wc -l'

text

### Health Checks

API Health

curl http://localhost:3000/health
MongoDB Connection

curl http://localhost:3000/health | jq '.mongodb'
Rate Limiter Status

curl http://localhost:3000/api/products -I | grep -i "x-ratelimit"

text

---

## 🛡️ Security Checks

### Check for Vulnerabilities

NPM audit

npm audit
Check outdated packages

npm outdated
Update dependencies

npm update

text

### Validate Configuration

Check .env file

cat .env | grep -v "^#" | grep -v "^$"
Verify JWT secret is strong

echo $JWT_SECRET | wc -c # Should be > 32 characters
Check CORS settings

grep "cors" src/index.ts

text

---

## 🔄 Reset/Clean Commands

### Clear Logs

Backup old logs

mv logs/all.log logs/all.log.$(date +%Y%m%d)
mv logs/error.log logs/error.log.$(date +%Y%m%d)
Or truncate

    logs/all.log
    logs/error.log

text

### Reset Database Metrics

curl -X POST
-H "Authorization: Bearer <TOKEN>"
http://localhost:3000/api/metrics/database/reset

text

### Clean Install

Remove node_modules

rm -rf node_modules package-lock.json
Fresh install

npm install
Restart

npm run dev

text

---

## 📞 When to Escalate

Escalate to L2 (Engineering) if:
- Database corruption suspected
- Unhandled exceptions in code
- Performance issues persist after basic troubleshooting
- Security incident detected

Escalate to L3 (Senior/Architect) if:
- Architecture changes needed
- Major service outage (SEV 1)
- Data loss occurred
- Multi-system failure

