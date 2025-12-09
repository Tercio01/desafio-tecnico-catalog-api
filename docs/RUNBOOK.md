# 🚨 RUNBOOK - Troubleshooting Guide

## Health Check

curl http://localhost:3000/api/health | jq .

text

## Problem 1: API is Slow (latency > 1s)

### Detection
- Health check shows database response time > 1000ms
- Logs show SLOW_QUERY entries

### Solutions
1. Create indexes: `npm run create-indexes`
2. Restart: `docker-compose restart mongodb api`
3. Check: `docker stats`

## Problem 2: Database is DOWN

### Detection

curl http://localhost:3000/api/health
checks.database === DOWN

text

### Action
1. Circuit breaker opens (fail fast)
2. Users see: "Service unavailable"
3. Cached data served if available

### Recovery

docker-compose restart mongodb
sleep 10
curl http://localhost:3000/api/health

text

## Problem 3: Circuit Breaker Open

### Detection
- Logs show: "Circuit Breaker OPEN"

### Fix
- Wait 60 seconds (auto recovery)
- Or: `docker-compose restart api`

## Monitoring Logs

docker-compose logs -f api | grep ERROR
docker-compose logs -f api | grep WARN
docker-compose logs -f api | jq .

text
