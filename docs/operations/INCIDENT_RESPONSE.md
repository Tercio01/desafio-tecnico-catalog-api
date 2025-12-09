# 🚨 Incident Response Plan

**Version:** 1.0.0  
**Last Updated:** 2025-12-09

---

## 🎯 Incident Severity Levels

### SEV 1 - Critical
**Impact:** Complete service outage, data loss risk  
**Response Time:** Immediate (< 15 minutes)  
**Examples:**
- API completely down
- Database connection lost
- Security breach detected
- Data corruption

### SEV 2 - High
**Impact:** Major functionality degraded  
**Response Time:** < 1 hour  
**Examples:**
- High error rate (> 10%)
- Severe performance degradation
- Authentication failures
- Circuit breaker stuck OPEN

### SEV 3 - Medium
**Impact:** Partial functionality affected  
**Response Time:** < 4 hours  
**Examples:**
- Slow queries (> 1000ms)
- Rate limiting issues
- Minor feature broken
- Memory leaks

### SEV 4 - Low
**Impact:** Minimal user impact  
**Response Time:** Next business day  
**Examples:**
- Documentation issues
- Non-critical logging errors
- UI/UX improvements

---

## 📋 Incident Response Process

### 1. Detection

Automated alerts (if configured)
Manual detection via monitoring
Quick health check

curl http://localhost:3000/health
Check error logs

tail -100 logs/error.log

text

### 2. Assessment
- Determine severity level
- Identify affected systems
- Estimate user impact
- Document initial findings

### 3. Communication
- Notify stakeholders
- Create incident ticket
- Update status page (if exists)
- Set up war room for SEV 1/2

### 4. Mitigation
**Immediate Actions:**

Restart service

npm run dev
Check resource usage

top
df -h
Review recent changes

git log --oneline -10
Rollback if needed

git revert <commit-hash>

text

### 5. Resolution
- Fix root cause
- Verify fix in staging
- Deploy to production
- Monitor for recurrence

### 6. Post-Incident
- Write incident report
- Conduct blameless postmortem
- Identify improvements
- Update runbook

---

## 🔥 SEV 1 Playbook: Complete API Outage

### Symptoms
- Health check returning errors
- All endpoints timing out
- Zero successful requests

### Immediate Actions (First 5 minutes)

1. Verify service is running

ps aux | grep node
systemctl status catalog-api # if using systemd
2. Check logs

tail -50 logs/error.log
3. Check MongoDB connection

curl http://localhost:3000/health
4. Check system resources

top
df -h
free -h

text

### Resolution Steps

Step 1: Restart application

pkill -f "node.*index.ts"
npm run dev
Step 2: If MongoDB issue, check connection
Verify .env MONGO_URI

cat .env | grep MONGO
Step 3: Check MongoDB Atlas
- Login to cloud.mongodb.com
- Verify cluster status
- Check IP whitelist
Step 4: If still failing, rollback

git log --oneline -5
git checkout <last-working-commit>
npm run dev

text

### Escalation
If not resolved in 15 minutes:
- Page on-call engineer
- Notify management
- Consider failover (if available)

---

## 🔥 SEV 2 Playbook: High Error Rate

### Symptoms
- Error rate > 10%
- Multiple 500 errors in logs
- Circuit breaker opening

### Immediate Actions

1. Identify error patterns

grep "error" logs/all.log | tail -50
2. Check database metrics

curl -H "Authorization: Bearer <TOKEN>"
http://localhost:3000/api/metrics/database
3. Check recent deployments

git log --oneline --since="1 hour ago"

text

### Resolution Steps

Step 1: Identify affected endpoints

grep "500" logs/all.log | awk '{print $X}' | sort | uniq -c
Step 2: Check circuit breaker state

grep "Circuit breaker" logs/all.log | tail -10
Step 3: Review recent code changes

git diff HEAD~1
Step 4: Consider rollback if recent deployment

git revert <commit-hash>
npm run dev

text

---

## 🔥 SEV 3 Playbook: Performance Degradation

### Symptoms
- Response times > 1000ms
- Slow query warnings
- Users reporting slowness

### Immediate Actions

1. Check slow queries

grep "SLOW QUERY" logs/all.log
2. Check database metrics

curl -H "Authorization: Bearer <TOKEN>"
http://localhost:3000/api/metrics/database
3. Monitor system resources

top
iostat -x 1

text

### Resolution Steps

Step 1: Identify slow endpoints

grep "REQUEST_COMPLETE" logs/all.log |
awk '$X > 1000' | tail -20
Step 2: Analyze slow queries
Review database indexes
Consider adding caching
Step 3: Restart if memory leak suspected

npm run dev
Step 4: Scale up if resource constrained
Add more server instances
Increase MongoDB cluster tier

text

---

## 📊 Incident Template

Incident Report: [TITLE]

Date: YYYY-MM-DD
Severity: SEV X
Duration: X hours
Status: Resolved / Investigating
Summary

Brief description of the incident.
Timeline

    00:00 - Incident detected

    00:15 - Initial response started

    00:30 - Root cause identified

    01:00 - Fix deployed

    01:15 - Incident resolved

Impact

    Affected endpoints: [list]

    Number of users affected: X

    Error rate: X%

    Downtime: X minutes

Root Cause

Detailed explanation of what caused the incident.
Resolution

Steps taken to resolve the incident.
Action Items

    Prevent similar issues

    Update monitoring

    Update runbook

    Training needs

Lessons Learned

What we learned and how we can improve.

text

---

## 🛠️ Emergency Contacts

### On-Call Rotation
- **Primary:** [Name] - [Phone]
- **Secondary:** [Name] - [Phone]
- **Manager:** [Name] - [Phone]

### External Services
- **MongoDB Support:** https://support.mongodb.com
- **Cloud Provider:** [Contact Info]
- **CDN Provider:** [Contact Info]

---

## 🔗 Related Documents

- [Runbook](./RUNBOOK.md)
- [Disaster Recovery Plan](./DISASTER_RECOVERY.md)
- [API Documentation](http://localhost:3000/api-docs)

