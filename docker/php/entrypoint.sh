#!/bin/sh
set -e

echo "Running Laravel production bootstrap..."

# Run database migrations
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