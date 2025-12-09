#!/bin/bash

# Restore Script for Catalog API
# Usage: ./restore.sh <backup-date>
# Example: ./restore.sh 20251209-120000

set -e

BACKUP_DIR="$HOME/backups/catalog-api"
BACKUP_DATE=$1

if [ -z "$BACKUP_DATE" ]; then
  echo "❌ Error: Backup date required"
  echo "Usage: $0 <backup-date>"
  echo ""
  echo "Available backups:"
  ls -1 "$BACKUP_DIR" | grep "config-" | sed 's/config-//' | sed 's/.tar.gz//' | sort -r | head -10
  exit 1
fi

echo "🔄 Starting restore from backup: $BACKUP_DATE"
echo ""

# Safety check
read -p "⚠️  This will overwrite current configuration. Continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 0
fi

# 1. Restore configuration
echo "📦 Restoring configuration..."
if [ -f "$BACKUP_DIR/config-$BACKUP_DATE.tar.gz" ]; then
  tar -xzf "$BACKUP_DIR/config-$BACKUP_DATE.tar.gz"
  echo "✅ Configuration restored"
else
  echo "❌ Config backup not found: config-$BACKUP_DATE.tar.gz"
  exit 1
fi

# 2. Restore MongoDB
echo "💾 Restoring MongoDB..."
if [ -d "$BACKUP_DIR/mongodb-$BACKUP_DATE" ]; then
  if command -v mongorestore &> /dev/null; then
    if [ -n "$MONGO_URI" ]; then
      read -p "⚠️  Restore database? This will DROP existing data! (yes/no): " CONFIRM_DB
      if [ "$CONFIRM_DB" = "yes" ]; then
        mongorestore --uri="$MONGO_URI" \
          --drop \
          --gzip \
          "$BACKUP_DIR/mongodb-$BACKUP_DATE"
        echo "✅ MongoDB restored"
      else
        echo "⏭️  Skipping database restore"
      fi
    else
      echo "⚠️  MONGO_URI not set, skipping database restore"
    fi
  else
    echo "⚠️  mongorestore not installed"
  fi
else
  echo "⚠️  MongoDB backup not found"
fi

# 3. Display manifest
echo ""
echo "📋 Backup Manifest:"
if [ -f "$BACKUP_DIR/manifest-$BACKUP_DATE.txt" ]; then
  cat "$BACKUP_DIR/manifest-$BACKUP_DATE.txt"
else
  echo "⚠️  Manifest not found"
fi

echo ""
echo "✅ Restore completed!"
echo ""
echo "Next steps:"
echo "1. Review restored .env file"
echo "2. Install dependencies: npm install"
echo "3. Start service: npm run dev"
echo "4. Verify health: curl http://localhost:3000/health"

