#!/bin/bash
BACKUP_FILE="/tmp/fdcl-db-$(date +%Y%m%d-%H%M).sql.gz"

mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" \
  --all-databases --single-transaction --quick \
  | gzip > "$BACKUP_FILE"

AWS_ACCESS_KEY_ID="${B2_BACKUP_KEY_ID}" \
AWS_SECRET_ACCESS_KEY="${B2_BACKUP_APP_KEY}" \
aws s3 cp "$BACKUP_FILE" \
  "s3://fdcl-db/fdcl-database-backup/$(basename $BACKUP_FILE)" \
  --endpoint-url https://s3.eu-central-003.backblazeb2.com \
  --region eu-central-003

rm -f /tmp/fdcl-db-*.sql.gz