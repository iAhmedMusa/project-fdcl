#!/bin/sh
set -e

echo "Running Laravel production bootstrap..."

# Wait for MySQL to be ready (up to 120 seconds)
echo "Waiting for database connection..."
max_attempts=60
attempt=0
until php artisan migrate --force --pretend 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "ERROR: Could not connect to database after $max_attempts attempts."
        echo "DB_HOST=${DB_HOST:-db} DB_PORT=${DB_PORT:-3306} DB_DATABASE=${DB_DATABASE} DB_USERNAME=${DB_USERNAME}"
        exit 1
    fi
    echo "  Attempt $attempt/$max_attempts - Database not ready, waiting 2s..."
    sleep 2
done
echo "Database connection established."

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Create storage symlink (safe to re-run)
php artisan storage:link --force

# Cache config, routes, views for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Write a ready marker so the healthcheck knows bootstrap is done
touch /var/www/html/storage/app/ready

echo "Bootstrap complete. Starting PHP-FPM..."

exec "$@"