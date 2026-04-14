# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Focus Digital Color Lab (FDCL) — a premium photo studio order management system for a business in Dhaka, Bangladesh. Laravel 11 monolith with Inertia.js v2 + React 18 frontend.

## Development Environment

Everything runs in Docker. The Laravel source lives in `src/`.

```bash
# Start/stop
docker compose up -d
docker compose down

# Shell into the PHP container (run artisan, composer, etc.)
docker compose exec -u focuslab app bash

# Artisan shorthand
docker compose exec -u focuslab app php artisan <command>

# npm (runs inside the vite container)
docker compose exec vite npm <command>

# Fresh database with seed data
docker compose exec -u focuslab app php artisan migrate:fresh --seed
```

Service URLs: App http://localhost:8000, Vite HMR http://localhost:5173, Mailpit http://localhost:8026, MySQL localhost:3307.

Port remappings (3307, 1026, 8026) exist because the host machine runs other containers on default ports.

## Build & Test

```bash
# PHP linting (Laravel Pint)
docker compose exec -u focuslab app ./vendor/bin/pint

# Run all tests
docker compose exec -u focuslab app php artisan test

# Run a single test file
docker compose exec -u focuslab app php artisan test --filter=ExampleTest

# Frontend build
docker compose exec vite npm run build
```

PHPUnit config is in `src/phpunit.xml`. Test suites: `tests/Unit` and `tests/Feature`.

## Architecture

### Backend (`src/`)

Standard Laravel 11 structure. Key differences from defaults:

- **Roles & permissions** via `spatie/laravel-permission`. Three roles: `customer`, `staff`, `admin`. Seeded in `database/seeders/RoleSeeder.php`.
- **Role middleware** defined in `bootstrap/app.php` — aliases `admin`, `staff`, `customer` map to custom middleware classes in `app/Http/Middleware/Ensure*.php`. Each checks `$user->hasRole(...)` and aborts 403.
- **Routes** are grouped by role in `routes/web.php`: `/dashboard` (customer), `/staff` (staff), `/admin` (admin). Auth routes come from Breeze (`routes/auth.php`).
- **Inertia bridge** — `HandleInertiaRequests` middleware registered globally on web stack. Controllers return `Inertia::render('Page/Name')` instead of Blade views.

### Frontend (`src/resources/js/`)

- `Pages/` — React page components, organized by role (`Customer/`, `Staff/`, `Admin/`) plus `Auth/` and `Profile/`.
- `Layouts/` — `AuthenticatedLayout.jsx` and `GuestLayout.jsx`.
- `Components/` — shared UI components (Breeze scaffolding).
- Tailwind CSS v3 with `@tailwindcss/forms`. Config in `src/tailwind.config.js`.
- Ziggy provides named Laravel routes in JS via `route()` helper.

### Docker (`docker/`)

Four services: `app` (PHP-FPM), `nginx`, `db` (MySQL 8.0), `vite` (Node 20), `mailpit`. PHP Dockerfile in `docker/php/`, Nginx config in `docker/nginx/`. Environment variables in `.env.docker` (root level).

## Deployment

Target is cPanel shared hosting (not Docker).

<!-- # Developer Workflow Rules

## Before touching any code, ALWAYS:

1. Summarize what you understood from the request
2. List the files you plan to create or modify
3. Outline your implementation approach step by step
4. Wait for explicit confirmation ("yes", "go ahead", "looks good") before making any changes
5. If anything is ambiguous, ask before proceeding

Do NOT write any code or modify any files until the developer confirms your understanding. -->

<!-- code-review-graph MCP tools -->

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool                        | Use when                                               |
| --------------------------- | ------------------------------------------------------ |
| `detect_changes`            | Reviewing code changes — gives risk-scored analysis    |
| `get_review_context`        | Need source snippets for review — token-efficient      |
| `get_impact_radius`         | Understanding blast radius of a change                 |
| `get_affected_flows`        | Finding which execution paths are impacted             |
| `query_graph`               | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes`     | Finding functions/classes by name or keyword           |
| `get_architecture_overview` | Understanding high-level codebase structure            |
| `refactor_tool`             | Planning renames, finding dead code                    |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
