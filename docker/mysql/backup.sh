#!/bin/bash
BACKUP_FILE="/tmp/fdcl-db-$(date +%Y%m%d-%H%M).sql.gz"

mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" \
  --all-databases --single-transaction --quick \
  | gzip > "$BACKUP_FILE"

curl -sf -u "${B2_BACKUP_KEY_ID}:${B2_BACKUP_APP_KEY}" \
  -T "$BACKUP_FILE" \
  "https://s3.eu-central-003.backblazeb2.com/fdcl-db/fdcl-database-backup/$(basename $BACKUP_FILE)"

rm -f /tmp/fdcl-db-*.sql.gz