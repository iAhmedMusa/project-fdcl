# Dozzle — Docker Log Monitoring

## What Is Dozzle

Lightweight, open source Docker log viewer. Free forever. No data stored, no limits.
Reads directly from Docker socket (read-only) — doesn't interfere with any existing logging including Coolify's built-in log viewer. Both work simultaneously from the same source (`stderr` → Docker stdout).

## What You Get

- Real-time log streaming for all containers in one UI
- Search and regex filter across logs
- Switch between `fdcl_app`, `fdcl_queue`, `fdcl_nginx`, `fdcl_db` in one screen
- No storage, no limits, no expiry

## Add to Production `docker-compose.yml`

```yaml
  dozzle:
    image: amir20/dozzle:latest
    container_name: fdcl_dozzle
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - "9999:8080"
    environment:
      DOZZLE_USERNAME: "${DOZZLE_USERNAME}"
      DOZZLE_PASSWORD: "${DOZZLE_PASSWORD}"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/healthcheck || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

Add to Coolify env vars:
```
DOZZLE_USERNAME=admin
DOZZLE_PASSWORD=your-strong-password-here
```

> `/var/run/docker.sock:ro` — read-only mount. Dozzle can only read logs, cannot control containers.

## Access

Navigate to `https://yourserver:9999` (or configure a subdomain via Coolify's proxy).

## Does It Affect Coolify Dashboard Logs?

No. Dozzle is a passive reader. Coolify dashboard logs continue working exactly as before. Same Docker stdout stream, two independent viewers.

## Verifying It Works

```bash
docker ps | grep fdcl_dozzle
```

Open the UI, select a container from the sidebar, logs stream in real time.
