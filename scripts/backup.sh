#!/bin/bash

# Backup Script for Catalog API
# Run this daily via cron: 0 2 * * * /path/to/backup.sh

set -e

BACKUP_DIR="$HOME/backups/catalog-api"
DATE=$(date +%Y%m%d-%H%M%S)
RETENTION_DAYS=30

echo "🔄 Starting backup at $(date)"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# 1. Backup configuration files
echo "📦 Backing up configuration..."
tar -czf "$BACKUP_DIR/config-$DATE.tar.gz" \
  .env \
  package.json \
  package-lock.json \
  tsconfig.json \
  2>/dev/null || echo "⚠️  Some config files not found"

# 2. Backup logs
echo "📝 Backing up logs..."
if [ -d "logs" ]; then
  tar -czf "$BACKUP_DIR/logs-$DATE.tar.gz" logs/
fi

# 3. Backup MongoDB (if mongodump available)
echo "💾 Checking for MongoDB backup..."
if command -v mongodump &> /dev/null; then
  if [ -n "$MONGO_URI" ]; then
    mongodump --uri="$MONGO_URI" \
      --out="$BACKUP_DIR/mongodb-$DATE" \
      --gzip
    echo "✅ MongoDB backup completed"
  else
    echo "⚠️  MONGO_URI not set, skipping database backup"
  fi
else
  echo "⚠️  mongodump not installed, skipping database backup"
fi

# 4. Create backup manifest
echo "📋 Creating manifest..."
cat > "$BACKUP_DIR/manifest-$DATE.txt" << MANIFEST
Backup Date: $(date)
Hostname: $(hostname)
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "N/A")
Git Branch: $(git branch --show-current 2>/dev/null || echo "N/A")
Node Version: $(node --version)
NPM Version: $(npm --version)
MANIFEST

# 5. Cleanup old backups
echo "🧹 Cleaning up old backups (>$RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -type d -name "mongodb-*" -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true

# 6. Summary
echo ""
echo "✅ Backup completed successfully!"
echo "📁 Location: $BACKUP_DIR"
echo "📊 Disk usage:"
du -sh "$BACKUP_DIR"
echo ""
ls -lh "$BACKUP_DIR" | tail -10

