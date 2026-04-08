# Focus Digital Color Lab (FDCL)

Premium photo studio order management system — Dhaka, Bangladesh.

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11 (PHP 8.3) |
| Frontend bridge | Inertia.js v2 |
| UI | React 18 + Tailwind CSS v3 |
| Build tool | Vite |
| Database | MySQL 8.0 |
| Web server | Nginx |
| Email preview | Mailpit |
| Dev environment | Docker + Docker Compose |
| Deployment | cPanel shared hosting |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [GitHub CLI](https://cli.github.com/) (optional, for repo management)

## Local Setup

### 1. Clone the repo

```bash
git clone git@github.com:iAhmedMusa/project-fdcl.git
cd project-fdcl
```

### 2. Configure environment files

```bash
# Docker environment (DB credentials, mail, etc.)
cp .env.docker.example .env.docker

# Laravel app environment
cp src/.env.example src/.env
```

Edit both files and fill in your values. For local Docker development the defaults in `.env.docker.example` work as-is if you just set passwords.

### 3. Generate Laravel app key

```bash
docker compose run --rm app php artisan key:generate
```

### 4. Start containers

```bash
docker compose up -d
```

### 5. Run migrations and seed

```bash
docker compose exec -u focuslab app php artisan migrate:fresh --seed
```

The app is now running at **http://localhost:8000**.

## Service URLs

| Service | URL |
|---|---|
| App | http://localhost:8000 |
| Vite HMR | http://localhost:5173 |
| Mailpit | http://localhost:8026 |
| MySQL | localhost:3307 |

> Port remappings (3307, 1026, 8026) exist to avoid conflicts with other local containers.

## Common Commands

```bash
# Shell into the PHP container
docker compose exec -u focuslab app bash

# Run Artisan commands
docker compose exec -u focuslab app php artisan <command>

# Run Composer commands
docker compose exec -u focuslab app composer <command>

# Run npm commands
docker compose exec vite npm <command>

# Fresh database with seed data
docker compose exec -u focuslab app php artisan migrate:fresh --seed

# PHP linting (Laravel Pint)
docker compose exec -u focuslab app ./vendor/bin/pint

# Run tests
docker compose exec -u focuslab app php artisan test

# Watch logs
docker compose logs -f app

# Stop all containers
docker compose down
```

## Roles

Three roles are seeded via `RoleSeeder`:

| Role | Dashboard path |
|---|---|
| `customer` | `/dashboard` |
| `staff` | `/staff` |
| `admin` | `/admin` |

## Google OAuth

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:8000/auth/google/callback` as an authorised redirect URI
4. Copy the Client ID and Secret into `src/.env`

## Project Structure

```
focus-lab/
├── docker/              # Docker service configs (PHP, Nginx, MySQL)
├── docker-compose.yml
├── .env.docker.example  # Docker env template
└── src/                 # Laravel application root
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/
    ├── resources/
    │   └── js/          # React + Inertia pages & components
    ├── routes/
    ├── tests/
    └── .env.example     # Laravel env template
```

## License

Private — all rights reserved.
