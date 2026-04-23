# Laravel Queue Worker — Production Setup (Coolify + Docker Compose)

## Why This Is Needed

Invoice SMS on order placement uses a **queued listener** (`SendInvoiceSmsOnOrderPlaced implements ShouldQueue`).  
When an order is placed, Laravel writes a job to the `jobs` database table and returns immediately.  
A separate **queue worker process** must be running to pick up and execute those jobs.

Without a worker:
- Orders place successfully ✓
- Jobs accumulate in the `jobs` table ✓
- SMS never sends ✗

The OTP SMS works because it calls `SmsService` directly (synchronous). Invoice SMS is async by design.

---

## The Fix — Add a `queue` Service to `docker-compose.yml`

Add this service block alongside your existing `app` service:

```yaml
  queue:
    build:
      context: ./docker/php
      dockerfile: Dockerfile
    container_name: fdcl_queue
    working_dir: /var/www/html
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    volumes:
      - ./src:/var/www/html
    depends_on:
      - db
      - app
    networks:
      - fdcl_network
    env_file:
      - .env.docker
    restart: unless-stopped
```

### Full `docker-compose.yml` after change

```yaml
services:
  app:
    build:
      context: ./docker/php
      dockerfile: Dockerfile
    container_name: fdcl_app
    working_dir: /var/www/html
    volumes:
      - ./src:/var/www/html
    depends_on:
      - db
      - mailpit
    networks:
      - fdcl_network
    env_file:
      - .env.docker

  queue:
    build:
      context: ./docker/php
      dockerfile: Dockerfile
    container_name: fdcl_queue
    working_dir: /var/www/html
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    volumes:
      - ./src:/var/www/html
    depends_on:
      - db
      - app
    networks:
      - fdcl_network
    env_file:
      - .env.docker
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: fdcl_nginx
    ports:
      - "8000:80"
    volumes:
      - ./src:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - fdcl_network

  db:
    image: mysql:8.0
    container_name: fdcl_db
    ports:
      - "3307:3306"
    volumes:
      - fdcl_mysql_data:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/conf.d/my.cnf
    env_file:
      - .env.docker
    networks:
      - fdcl_network

  mailpit:
    image: axllent/mailpit
    container_name: fdcl_mailpit
    ports:
      - "8026:8025"
      - "1026:1025"
    networks:
      - fdcl_network

volumes:
  fdcl_mysql_data:

networks:
  fdcl_network:
    driver: bridge
```

> `vite` service is intentionally omitted — not needed in production.

---

## Deploying via Coolify

1. Merge the `docker-compose.yml` change into your `prod` branch.
2. Push to remote — Coolify detects the change and redeploys automatically (or trigger manually from the Coolify dashboard).
3. Coolify will spin up the new `fdcl_queue` container alongside the existing ones.
4. No other config needed — it shares the same image build, volumes, env, and DB connection.

---

## Verifying It Works

**Check the container is running:**
```bash
docker ps | grep fdcl_queue
```

**Watch the worker logs live:**
```bash
docker logs -f fdcl_queue
```

You should see output like:
```
[2026-04-23 12:00:00] Processing: App\Listeners\SendInvoiceSmsOnOrderPlaced
[2026-04-23 12:00:01] Processed:  App\Listeners\SendInvoiceSmsOnOrderPlaced
```

**Check for stuck/failed jobs:**
```bash
# Inside the app container
docker exec -it fdcl_app php artisan queue:failed
```

**Retry failed jobs:**
```bash
docker exec -it fdcl_app php artisan queue:retry all
```

---

---

## Production `docker-compose.yml` (Coolify)

### What changed

Two things added to your existing prod compose file:

```diff
+# 1. YAML anchor — define env vars once, reuse in queue (no duplication)
+x-app-environment: &app-environment
+  APP_NAME: "${APP_NAME:-Focus Digital Color Lab}"
+  # ... (full block — see file below)

 services:
   app:
-    environment:
-      APP_NAME: "${APP_NAME:-Focus Digital Color Lab}"
-      # ...
+    environment:
+      <<: *app-environment    # ← pulls from anchor

+  # 2. NEW queue worker service
+  queue:
+    build:
+      context: .
+      dockerfile: docker/php/Dockerfile.prod
+    container_name: fdcl_queue
+    restart: unless-stopped
+    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
+    depends_on:
+      db:
+        condition: service_healthy
+      app:
+        condition: service_healthy
+    environment:
+      <<: *app-environment    # ← same vars, no copy-paste
+    volumes:
+      - fdcl_storage:/var/www/html/storage
+    healthcheck:
+      test: ["CMD-SHELL", "php artisan --version || exit 1"]
+      interval: 30s
+      timeout: 5s
+      retries: 3
+      start_period: 30s
```

### Full production `docker-compose.yml`

```yaml
# Shared environment block — referenced by app and queue via YAML anchor
x-app-environment: &app-environment
  APP_NAME: "${APP_NAME:-Focus Digital Color Lab}"
  APP_ENV: production
  APP_KEY: "${APP_KEY}"
  APP_DEBUG: "${APP_DEBUG:-false}"
  APP_URL: "${APP_URL}"
  APP_TIMEZONE: "${APP_TIMEZONE:-Asia/Dhaka}"
  LOG_CHANNEL: stderr
  LOG_LEVEL: "${LOG_LEVEL:-warning}"
  DB_CONNECTION: mysql
  DB_HOST: "${DB_HOST:-db}"
  DB_PORT: "${DB_PORT:-3306}"
  DB_DATABASE: "${DB_DATABASE}"
  DB_USERNAME: "${DB_USERNAME}"
  DB_PASSWORD: "${DB_PASSWORD}"
  SESSION_DRIVER: database
  SESSION_LIFETIME: "${SESSION_LIFETIME:-120}"
  SESSION_DOMAIN: "${SESSION_DOMAIN:-focusdigitalcolorlab.com}"
  SESSION_SECURE_COOKIE: "${SESSION_SECURE_COOKIE:-true}"
  CACHE_STORE: database
  QUEUE_CONNECTION: database
  MAIL_MAILER: "${MAIL_MAILER:-smtp}"
  MAIL_HOST: "${MAIL_HOST}"
  MAIL_PORT: "${MAIL_PORT:-587}"
  MAIL_USERNAME: "${MAIL_USERNAME}"
  MAIL_PASSWORD: "${MAIL_PASSWORD}"
  MAIL_ENCRYPTION: "${MAIL_ENCRYPTION:-tls}"
  MAIL_FROM_ADDRESS: "${MAIL_FROM_ADDRESS:-noreply@focusdigitalcolorlab.com}"
  MAIL_FROM_NAME: "${MAIL_FROM_NAME:-Focus Digital Color Lab}"
  GOOGLE_CLIENT_ID: "${GOOGLE_CLIENT_ID}"
  GOOGLE_CLIENT_SECRET: "${GOOGLE_CLIENT_SECRET}"
  GOOGLE_REDIRECT_URI: "${GOOGLE_REDIRECT_URI}"
  FILESYSTEM_DISK: "${FILESYSTEM_DISK:-s3}"
  AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
  AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
  AWS_DEFAULT_REGION: "${AWS_DEFAULT_REGION:-eu-central-003}"
  AWS_BUCKET: "${AWS_BUCKET:-fdcl-photos}"
  AWS_ENDPOINT: "${AWS_ENDPOINT:-https://s3.eu-central-003.backblazeb2.com}"
  AWS_USE_PATH_STYLE_ENDPOINT: "${AWS_USE_PATH_STYLE_ENDPOINT:-true}"
  BULKSMS_API_KEY: "${BULKSMS_API_KEY}"
  BULKSMS_SENDER_ID: "${BULKSMS_SENDER_ID}"

services:
  app:
    build:
      context: .
      dockerfile: docker/php/Dockerfile.prod
    container_name: fdcl_app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      <<: *app-environment
    volumes:
      - fdcl_storage:/var/www/html/storage
    healthcheck:
      test: ["CMD-SHELL", "test -f /var/www/html/storage/app/ready || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 120s

  # ✅ NEW — queue worker
  queue:
    build:
      context: .
      dockerfile: docker/php/Dockerfile.prod
    container_name: fdcl_queue
    restart: unless-stopped
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    depends_on:
      db:
        condition: service_healthy
      app:
        condition: service_healthy
    environment:
      <<: *app-environment
    volumes:
      - fdcl_storage:/var/www/html/storage
    healthcheck:
      test: ["CMD-SHELL", "php artisan --version || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s

  nginx:
    build:
      context: .
      dockerfile: docker/nginx/Dockerfile.prod
    container_name: fdcl_nginx
    restart: unless-stopped
    volumes:
      - fdcl_storage:/var/www/html/storage
    depends_on:
      app:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost/up || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s

  db:
    build:
      context: .
      dockerfile: docker/mysql/Dockerfile
    container_name: fdcl_db
    restart: unless-stopped
    volumes:
      - fdcl_mysql_data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: "${DB_DATABASE:-focus_lab}"
      MYSQL_USER: "${DB_USERNAME:-focuslab}"
      MYSQL_PASSWORD: "${DB_PASSWORD:-secret}"
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD:-rootsecret}"
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "mysqladmin ping -h localhost -u root -p$${MYSQL_ROOT_PASSWORD} || exit 1",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  fdcl_mysql_data:
  fdcl_storage:
```

> **YAML anchor (`&app-environment` / `<<: *app-environment`):** Coolify injects env vars at compose parse time — `${VAR}` substitution happens once at the top-level anchor, both `app` and `queue` containers receive identical vars. Add/remove a var in one place only.

> **Queue healthcheck:** `php artisan --version` is lightweight and always true when the container is healthy. Gives Coolify a proper `healthy` status tick without any overhead.

> **Startup order:** `db` healthy → `app` healthy (ready file exists) → `queue` starts. Worker never touches DB before it's up or before migrations have run.

---

## Flag Reference

| Flag | Value | Meaning |
|------|-------|---------|
| `--sleep` | `3` | Seconds to wait when no jobs in queue |
| `--tries` | `3` | Max attempts before marking job as failed |
| `--max-time` | `3600` | Worker restarts itself after 1 hour (prevents memory leaks) |
| `restart: unless-stopped` | — | Docker auto-restarts container if it exits (e.g. after `--max-time`) |
