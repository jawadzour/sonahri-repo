# Deploying to Render (+ Neon for Postgres)

This repo deploys as **three services** on Render, defined together in
`render.yaml`:

| Service | What it is | Runtime |
|---|---|---|
| `shds-website` | Main site (React + Express/tRPC) | Node |
| `shds-backend` | Flask API (contact form, donations, admin data) | Docker |
| `shds-admin` | Standalone admin panel (talks to `shds-backend`) | Static site |

**Everything on Render runs on the free tier** (`plan: free`) to keep
Render's cost at $0/month. Postgres is **not** hosted on Render —
Render's free Postgres auto-deletes after 30 days, so both databases
live on [Neon](https://neon.tech) instead, which has a genuinely
permanent free tier (0.5 GB storage, 100 compute-hours/month, no
credit card required).

## 0) Create two free Neon projects

Sign up at [neon.tech](https://neon.tech) (no credit card needed), then
create two projects:

1. **`shds-db`** — for the main site
2. **`shds-backend-db`** — for the Flask backend

For each project, open its dashboard → **Connection Details** → copy
the **pooled connection string** (not the direct one — the pooled
connection handles Neon's scale-to-zero behavior better for a web app).
It looks like:

```
postgresql://<user>:<password>@<host>-pooler.<region>.aws.neon.tech/<dbname>?sslmode=require
```

Keep both connection strings handy for step 2.

### Email: Brevo, not SMTP

Render blocks outbound traffic to SMTP ports (25/465/587) on free-tier
web services, so Gmail-SMTP-style sending (what this project used
originally) doesn't work once deployed there. `shds-backend` sends
email via [Brevo](https://brevo.com)'s HTTP API instead — HTTPS isn't
blocked, and Brevo's free tier (300 emails/day, no credit card) only
needs one verified sender address, not a whole domain:

1. Sign up at [brevo.com](https://brevo.com)
2. **Senders & IP** → **Senders** → add and verify a sender email
   (click the confirmation link Brevo emails you)
3. **SMTP & API** → **API Keys** → generate a new key

Keep the API key and the verified sender email handy for step 2.

## 1) Deploy via Blueprint

- Render Dashboard → **New** → **Blueprint** → connect the
  `jawadzour/sonahri-repo` GitHub repo.
- Render detects `render.yaml` and shows a plan to create all three
  services (no databases — those are on Neon now).

(Alternative: all three services can also be created directly via
Render's REST API — `POST /v1/services` once per service, mirroring
the fields in `render.yaml` — if you'd rather script it than click
through the dashboard. There's no API endpoint to trigger a Blueprint
sync directly; `/v1/blueprints` is read-only.)

## 2) Fill in the secrets it asks for

Every env var marked `sync: false` in `render.yaml` gets prompted for
during that initial Blueprint creation (values are never stored in the
repo). Have these ready:

- **`shds-website`**: `DATABASE_URL` (the `shds-db` Neon pooled
  connection string from step 0), `JWT_SECRET` (any long random
  string), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` — generate the hash
  locally with `node scripts/generate-password-hash.mjs "yourpassword"`.
- **`shds-backend`**: `DATABASE_URL` (the `shds-backend-db` Neon pooled
  connection string), `SECRET_KEY`, `JWT_SECRET_KEY` (any long random
  strings, different from each other), `BREVO_API_KEY` (see "Email"
  below for why it's Brevo and not Gmail SMTP).

Everything else (the cross-service URLs, `NODE_ENV`, `APP_CONFIG`,
etc.) is already wired up in `render.yaml`.

## 3) What happens automatically on deploy — and what doesn't (free tier)

`render.yaml` defines `preDeployCommand` for both `shds-website`
(`pnpm exec drizzle-kit migrate`) and `shds-backend` (`flask db
upgrade`) to apply migrations before each deploy. **`preDeployCommand`
is a paid-plan-only feature** — Render silently ignores it on `plan:
free` services, so migrations do NOT run automatically here. Likewise,
**Shell/SSH access is also paid-only**, so you can't just open a shell
on the live service to run one-off commands the way you normally
would.

The workaround: since both Neon databases are reachable from anywhere
on the internet (not just from Render), run migrations **locally**,
pointing at the production connection strings, before or right after
each deploy that changes the schema:

```bash
# Main site — from the repo root
DATABASE_URL="<shds-db pooled connection string>" pnpm exec drizzle-kit migrate

# Flask backend — from shds-backend/, with the venv active
DATABASE_URL="<shds-backend-db pooled connection string>" APP_CONFIG=production FLASK_APP=wsgi.py python -m flask db upgrade
```

`shds-admin` has no database/migration step — it's a static build.

## 4) One manual step: create the first shds-backend admin

Same constraint as above — no Shell access on free tier, so run this
locally too, pointing at the production `shds-backend-db`:

```bash
cd shds-backend
DATABASE_URL="<shds-backend-db pooled connection string>" APP_CONFIG=production FLASK_APP=wsgi.py python -m flask create-admin --name "Admin" --email "you@example.com" --password "yourpassword"
```

This is the login for the `shds-admin` panel.

The main site's own `/admin/login` uses `ADMIN_EMAIL` /
`ADMIN_PASSWORD_HASH` instead — no extra step needed there.

## 5) Verify

- Visit `shds-website`'s URL — confirm the homepage loads.
- Submit the Contact and Donate forms — confirm they succeed and that
  the branded confirmation emails arrive (via the `BREVO_*` config on
  `shds-backend`).
- Visit `shds-admin`'s URL and log in with the account from step 4.

## Free tier tradeoffs

- **Neon compute scale-to-zero**: each database's compute suspends
  after inactivity and wakes on the next query — usually adds a brief
  delay to the first request after idle, not data loss. Exceeding the
  0.5 GB storage or 100 compute-hours/month cap suspends the database
  until next month (upgrade to resume immediately if that happens).
- **Render cold starts**: `shds-website` and `shds-backend` spin down
  after 15 minutes of no traffic and take ~1 minute to wake up on the
  next request.
- **750 free Render instance-hours/month total**, shared across all
  free services in the workspace. Both web services here count against
  it.
- **No persistent file storage on shds-backend**: free Render web
  services can't have a disk attached, so anything written to
  `uploads/` (donation payment screenshots) is lost on every redeploy
  or restart. If that matters, upgrade `shds-backend` to a paid Render
  plan and add a `disk:` block (see git history for the exact config
  that was removed to hit $0/month).
- **No `preDeployCommand` or Shell access**: both are paid-only — see
  section 3/4 above for the workaround (run migrations/admin-creation
  locally against the production Neon connection strings instead).
- **Memory is tight (512MB)**: `shds-backend/gunicorn.conf.py` computes
  a worker count from `cpu_count() * 2 + 1`, which reflects the *host*
  machine's cores on a shared platform like Render, not this
  container's actual allocation — left uncapped it spawns enough
  gunicorn workers to OOM-crash before the first request. It's capped
  at 4 by default; override with the `GUNICORN_WORKERS` env var if you
  need to tune it further for your plan.

## Notes & troubleshooting

- **`VITE_*` env vars are build-time**: if you change `VITE_SHDS_API_URL`
  or `VITE_API_BASE_URL` after the fact, you need a new deploy (not
  just a restart) for the change to take effect — Vite bakes them into
  the built JS bundle.
- If a service's default `.onrender.com` name differs from what's
  hardcoded in `render.yaml` (Render appends a suffix if the name is
  taken), update the cross-referenced `CORS_ORIGINS` /
  `VITE_SHDS_API_URL` / `VITE_API_BASE_URL` / `BACKEND_BASE_URL` /
  `ADMIN_FRONTEND_URL` values to match, then redeploy.
- For zero-downtime deploys or extra services (worker, cron), add more
  entries under `services:` in `render.yaml`.
