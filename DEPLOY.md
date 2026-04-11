# Deploying to Production with Coolify

## Prerequisites

- A Coolify server running v4.x
- A domain pointing to your server (e.g. `focuslab.com.bd`)
- SSL certificate configured in Coolify (Let's Encrypt recommended)

---

## Step 1: Connect Repository

1. Go to **Projects** → **+ Add New Resource** → **Docker Compose**
2. Name it `fdcl`
3. Under **Source**, select **Git Repository**
4. Connect your GitHub repo and select the **`prod`** branch
5. Coolify will detect `docker-compose.prod.yml` automatically

---

## Step 2: Configure Environment Variables

Go to **Resource** → **Environment** and add the following variables.
Mark passwords/secrets as **Locked** (🔒 icon) so they're encrypted.

### Required

| Variable | Value | Locked |
|---|---|---|
| `APP_KEY` | Generate with `php artisan key:generate` | ✅ |
| `APP_URL` | `https://focuslab.com.bd` | ❌ |
| `DB_DATABASE` | `focus_lab` | ❌ |
| `DB_USERNAME` | `focuslab` | ❌ |
| `DB_PASSWORD` | *Strong random password* | ✅ |
| `MYSQL_ROOT_PASSWORD` | *Strong random password* | ✅ |
| `MAIL_HOST` | `smtp.gmail.com` (or your SMTP) | ❌ |
| `MAIL_PORT` | `587` | ❌ |
| `MAIL_USERNAME` | Your SMTP username | ✅ |
| `MAIL_PASSWORD` | Your SMTP password | ✅ |
| `MAIL_FROM_ADDRESS` | `noreply@focuslab.com.bd` | ❌ |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | ❌ |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | ✅ |
| `GOOGLE_REDIRECT_URI` | `https://focuslab.com.bd/auth/google/callback` | ❌ |

### Optional overrides (defaults are in docker-compose.prod.yml)

| Variable | Default | Override if needed |
|---|---|---|
| `APP_NAME` | `Focus Digital Color Lab` | ❌ |
| `APP_ENV` | `production` | ❌ |
| `APP_TIMEZONE` | `Asia/Dhaka` | ❌ |
| `LOG_LEVEL` | `warning` | ❌ |
| `SESSION_DRIVER` | `database` | ❌ |
| `CACHE_STORE` | `database` | ❌ |

---

## Step 3: Configure Domain & SSL

1. Go to **Resource** → **Domains**
2. Add your domain: `focuslab.com.bd`
3. Enable **Let's Encrypt** for automatic SSL
4. Coolify will proxy HTTPS traffic to nginx on port 80

---

## Step 4: Persistent Volume

Coolify manages named volumes automatically. The `fdcl_mysql_data` volume
in `docker-compose.prod.yml` persists MySQL data across deployments.

To verify: **Resource** → **Volumes** should show `fdcl_mysql_data`.

---

## Step 5: Deploy

1. Click **Deploy** in the Coolify dashboard
2. The first build will take 3-5 minutes (Dockerfile.prod multi-stage build)
3. Watch the deployment logs for:
   - **app** image build (Dockerfile.prod multi-stage: Vite build → Composer install)
   - **nginx** image build (copies prod.conf into image)
   - **db** image build (copies my.cnf into image)
   - Database migrations (entrypoint.sh)
   - Config/route/view caching (entrypoint.sh)

---

## Step 6: Generate App Key

If you haven't set `APP_KEY` yet:

1. Open a **terminal** on the Coolify server
2. Run:
   ```bash
   docker exec -it fdcl_app php artisan key:generate
   ```
3. Copy the generated key
4. Go to **Environment** → set `APP_KEY` → **Redeploy**

---

## Updating

1. Push changes to the `prod` branch
2. Coolify will auto-deploy if **Watchtower** is enabled
3. Or click **Deploy** manually to pull the latest commit

---

## Troubleshooting

| Issue | Fix |
|---|---|
| 502 Bad Gateway | `fdcl_app` not healthy — check `docker logs fdcl_app` |
| DB connection refused | `fdcl_db` not ready — wait 30s or check `docker logs fdcl_db` |
| Missing APP_KEY | Run `php artisan key:generate` in the app container |
| CSS/JS not loading | Run `php artisan storage:link` and check `public/build/` exists |
| Permission errors | `docker exec fdcl_app chown -R www-data:www-data storage bootstrap/cache` |