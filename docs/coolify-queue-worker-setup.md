# Coolify Queue Worker Setup

Laravel queue worker must run as a separate process in Coolify. Three options:

---

## Option A — Coolify Worker Resource (Recommended)

1. Open your app in Coolify UI
2. Go to **Resources** → **Add Worker**
3. Set command:
   ```
   php artisan queue:work --sleep=3 --tries=3 --max-time=3600
   ```
4. Deploy

---

## Option B — Procfile

Add `Procfile` to repo root (or `src/`):

```
web: php-fpm
worker: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

---

## Option C — Supervisord (same container)

Add to `docker/php/supervisord.conf`:

```ini
[program:laravel-worker]
command=php /var/www/html/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

---

## Verify Worker is Running

```bash
php artisan queue:monitor
# or check failed jobs
php artisan queue:failed
```

## Notes

- `SESSION_DRIVER=database` — sessions table must be migrated in production
- Queue connection set via `QUEUE_CONNECTION` in `.env` (default: `sync` — change to `database` or `redis`)
- Failed jobs table: `php artisan queue:failed-table && php artisan migrate`
