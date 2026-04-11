#!/bin/sh

echo "Running Laravel production bootstrap..."

# Wait for MySQL to be ready (up to 120 seconds)
echo "Waiting for database connection..."
max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if php -r "new PDO('mysql:host=${DB_HOST:-db};port=${DB_PORT:-3306};dbname=${DB_DATABASE:-focus_lab}', '${DB_USERNAME:-focuslab}', '${DB_PASSWORD}');" 2>/dev/null; then
        echo "Database connection established."
        break
    fi
    attempt=$((attempt + 1))
    echo "  Attempt $attempt/$max_attempts - Database not ready, waiting 2s..."
    sleep 2
done

if [ $attempt -ge $max_attempts ]; then
    echo "WARNING: Could not connect to database after $max_attempts attempts. Starting anyway..."
else
    # Run database migrations
    echo "Running migrations..."
    php artisan migrate --force || echo "WARNING: Migrations failed. Check logs."

    # Create storage symlink (safe to re-run)
    php artisan storage:link --force || true

    # Cache config, routes, views for performance
    php artisan config:cache 2>/dev/null || true
    php artisan route:cache 2>/dev/null || true
    php artisan view:cache 2>/dev/null || true
fi

# Write a ready marker so the healthcheck knows bootstrap is done
touch /var/www/html/storage/app/ready

echo "Bootstrap complete. Starting PHP-FPM..."

exec "$@"