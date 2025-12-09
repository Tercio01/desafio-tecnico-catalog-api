# 🆘 Disaster Recovery Plan

**Version:** 1.0.0  
**Last Updated:** 2025-12-09  
**Review Frequency:** Quarterly

---

## 🎯 Recovery Objectives

### RTO (Recovery Time Objective)
**Target:** < 4 hours  
Time to restore service after total failure

### RPO (Recovery Point Objective)
**Target:** < 1 hour  
Maximum acceptable data loss

### Service Level Targets
- **Availability:** 99.9% (8.76 hours downtime/year)
- **Data Durability:** 99.999999999% (11 nines)
- **Backup Frequency:** Continuous + Daily snapshots

---

## 🔄 Backup Strategy

### Database Backups (MongoDB Atlas)

**Automated Backups:**
- **Frequency:** Continuous (Point-in-Time Recovery)
- **Retention:** 7 days
- **Storage:** MongoDB Atlas Cloud Backup
- **Testing:** Monthly restore drills

**Verification:**

Check MongoDB Atlas backup status
Login to https://cloud.mongodb.com
Navigate to: Cluster > Backup > Snapshots

text

**Manual Backup (Emergency):**

Export entire database

mongodump --uri="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/catalog"
--out=./backup-$(date +%Y%m%d-%H%M%S)
Compress backup

tar -czf backup-$(date +%Y%m%d).tar.gz backup-*/
Upload to secure location
aws s3 cp backup-*.tar.gz s3://backups/

text

---

### Application Backups

**Code Repository:**
- **Location:** GitHub
- **Frequency:** Every commit
- **Retention:** Indefinite
- **Branches:** Protected main branch

**Configuration Files:**

Backup .env (encrypted)

gpg -c .env
mv .env.gpg ~/secure-backup/
Backup important configs

tar -czf config-backup-$(date +%Y%m%d).tar.gz
.env package.json package-lock.json

text

**Logs:**

Archive old logs monthly

mkdir -p archives/$(date +%Y-%m)
mv logs/*.log archives/$(date +%Y-%m)/
Compress

tar -czf logs-archive-$(date +%Y-%m).tar.gz archives/$(date +%Y-%m)/

text

---

## 🚨 Disaster Scenarios

### Scenario 1: Complete Server Failure

**Impact:** SEV 1 - Total service outage

**Detection:**
- Health checks failing
- All endpoints unreachable
- No server response

**Recovery Steps:**

1. **Immediate (0-15 min):**

Assess damage
Check if hardware or software issue
If software issue:

git clone https://github.com/user/catalog-api.git
cd catalog-api
npm install
cp ~/secure-backup/.env.gpg .
gpg -d .env.gpg > .env
npm run dev

text

2. **Provision New Server (15-60 min):**

Setup new server

sudo apt update
sudo apt install nodejs npm mongodb-tools
Clone repository

git clone https://github.com/user/catalog-api.git
cd catalog-api
Install dependencies

npm install
Configure environment

nano .env # Add all required variables
Start service

npm run dev
Verify health

curl http://localhost:3000/health

text

3. **Restore from Backup (if needed):**

If database corrupted, restore from MongoDB Atlas
Or restore from manual backup:

mongorestore --uri="mongodb+srv://..."
--drop ./backup-YYYYMMDD/

text

**Validation:**

Health check

curl http://localhost:3000/health
Test critical endpoints

curl http://localhost:3000/api/products
Run smoke tests

npm run test:load:short

text

**RTO:** 1-4 hours  
**RPO:** < 1 hour (MongoDB continuous backup)

---

### Scenario 2: Database Corruption/Loss

**Impact:** SEV 1 - Data integrity compromised

**Detection:**
- Database connection errors
- Data inconsistencies
- Mongoose validation errors

**Recovery Steps:**

1. **Assess Damage (0-15 min):**

Check MongoDB Atlas status
Login to cloud.mongodb.com
Check cluster health
Verify data integrity

mongosh "mongodb+srv://..." --eval "db.products.countDocuments()"

text

2. **Point-in-Time Recovery (15-60 min):**

MongoDB Atlas: Restore to specific timestamp
Navigate to: Backup > Point in Time Restore
Select: Target Time (before corruption)
Action: Download or Restore to Cluster
If restoring to same cluster:
- Service will be temporarily unavailable
- Update connection string if needed

text

3. **Manual Restore (Alternative):**

Restore from manual backup

mongorestore --uri="mongodb+srv://..."
--nsInclude="catalog.*"
--drop ./backup-YYYYMMDD/

text

**Validation:**

Verify data integrity

curl http://localhost:3000/api/products | jq '.count'
Check critical records

curl http://localhost:3000/api/products | jq '.data'
Test CRUD operations
Create, Read, Update, Delete test product

text

**RTO:** 1-2 hours  
**RPO:** < 5 minutes (continuous backup)

---

### Scenario 3: Security Breach

**Impact:** SEV 1 - Security compromised

**Detection:**
- Unauthorized access logs
- Suspicious database activity
- Alert from security monitoring

**Recovery Steps:**

1. **Immediate Containment (0-15 min):**

Shut down service

pkill -f node
Rotate all secrets
Generate new JWT_SECRET

openssl rand -base64 64
Update .env with new secrets

nano .env
Revoke all existing tokens
(Users must login again)

text

2. **Investigation (15-60 min):**

Review access logs

grep "401|403|500" logs/all.log
Check for unauthorized changes

git log --all --since="24 hours ago"
Review database audit logs (if enabled)
MongoDB Atlas: Database Access > Activity Feed

text

3. **Recovery & Hardening (1-4 hours):**

Reset database credentials
MongoDB Atlas: Database Access > Reset Password
Update IP whitelist
MongoDB Atlas: Network Access > Update IPs
Force all users to reset passwords
(Application-level: invalidate all sessions)
Review and patch vulnerabilities

npm audit fix
npm update

text

**Validation:**

Verify new secrets working

curl -X POST http://localhost:3000/api/auth/login
-H "Content-Type: application/json"
-d '{"email":"admin@example.com","password":"NEW_PASSWORD"}'
Run security scan

npm audit

text

**RTO:** 2-4 hours  
**RPO:** < 1 hour

---

## 🧪 Testing & Drills

### Monthly DR Drill

1. Backup current state

mongodump --uri="..." --out=./dr-drill-backup
2. Simulate failure
- Stop service
- Delete test data
3. Execute recovery procedure
- Follow disaster recovery steps
- Restore from backup
- Verify functionality
4. Document results
- Time to recovery
- Issues encountered
- Process improvements

text

### Quarterly Full DR Test
- Complete server rebuild
- Database restore from backup
- Full application deployment
- End-to-end testing
- Update DR plan based on findings

---

## 📋 DR Checklist

### Pre-Disaster Preparation
- [ ] MongoDB Atlas continuous backup enabled
- [ ] .env file backed up (encrypted)
- [ ] Code repository up to date
- [ ] Documentation accessible offline
- [ ] Contact list updated
- [ ] DR plan reviewed quarterly

### During Disaster
- [ ] Assess severity and impact
- [ ] Notify stakeholders
- [ ] Execute appropriate recovery plan
- [ ] Document all actions
- [ ] Communicate status updates

### Post-Disaster
- [ ] Verify full functionality
- [ ] Complete incident report
- [ ] Conduct postmortem
- [ ] Update DR plan
- [ ] Test backup/restore process

---

## 🔗 Critical Information

### MongoDB Atlas Access
- **URL:** https://cloud.mongodb.com
- **Cluster:** Cluster0
- **Database:** catalog
- **User:** desafio_tecnico_v2

### GitHub Repository
- **URL:** https://github.com/user/catalog-api
- **Main Branch:** main
- **Protected:** Yes

### Environment Variables (Required)

PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=<64-char-secret>
JWT_EXPIRE=1d
NODE_ENV=production
LOG_LEVEL=info

text

---

## 📞 Emergency Contacts

### Internal
- **DevOps Lead:** [Name] - [Phone]
- **Backend Lead:** [Name] - [Phone]
- **CTO:** [Name] - [Phone]

### External
- **MongoDB Support:** https://support.mongodb.com
- **GitHub Support:** https://support.github.com

---

## 📚 Related Documents

- [Runbook](./RUNBOOK.md)
- [Incident Response](./INCIDENT_RESPONSE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

