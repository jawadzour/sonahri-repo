# Deploying to Render

This repo deploys as **three services** on Render, defined together in
`render.yaml`:

| Service | What it is | Runtime |
|---|---|---|
| `shds-website` | Main site (React + Express/tRPC) | Node |
| `shds-backend` | Flask API (contact form, donations, admin data) | Docker |
| `shds-admin` | Standalone admin panel (talks to `shds-backend`) | Static site |

Plus two managed Postgres databases, one per app: `shds-db` (main site)
and `shds-backend-db` (Flask backend). They're kept separate because
each app owns its own migration history (Drizzle vs. Alembic).

## 1) Deploy via Blueprint

- Render Dashboard → **New** → **Blueprint** → connect the
  `jawadzour/sonahri-repo` GitHub repo.
- Render detects `render.yaml` and shows a plan to create both
  databases and all three services.

## 2) Fill in the secrets it asks for

Every env var marked `sync: false` in `render.yaml` gets prompted for
during that initial Blueprint creation (values are never stored in the
repo). Have these ready:

- **`shds-website`**: `JWT_SECRET` (any long random string), `ADMIN_EMAIL`,
  `ADMIN_PASSWORD_HASH` — generate the hash locally with
  `node scripts/generate-password-hash.mjs "yourpassword"`.
- **`shds-backend`**: `SECRET_KEY`, `JWT_SECRET_KEY` (any long random
  strings, different from each other), `MAIL_PASSWORD` (a Gmail App
  Password — see `shds-backend/.env.example` for how to generate one).

Everything else (`DATABASE_URL`, the cross-service URLs, `NODE_ENV`,
`APP_CONFIG`, etc.) is already wired up in `render.yaml`.

## 3) What happens automatically on deploy

- `shds-website`: `pnpm install --prod=false && pnpm build`, then
  `pnpm exec drizzle-kit migrate` (applies committed migrations from
  `drizzle/`) before starting with `pnpm start`.
- `shds-backend`: builds from `shds-backend/Dockerfile`, then runs
  `flask db upgrade` (applies Alembic migrations from
  `shds-backend/migrations/`) before starting `gunicorn`.
- `shds-admin`: builds as a static site and serves `shds-admin/dist`.

## 4) One manual step: create the first shds-backend admin

`flask db upgrade` creates the schema but not an admin user — that
command is interactive. After `shds-backend` is live, open its
**Shell** tab in the Render dashboard and run:

```bash
flask create-admin
```

It'll prompt for name/email/password. This is the login for the
`shds-admin` panel.

The main site's own `/admin/login` uses `ADMIN_EMAIL` /
`ADMIN_PASSWORD_HASH` instead — no extra step needed there.

## 5) Verify

- Visit `shds-website`'s URL — confirm the homepage loads.
- Submit the Contact and Donate forms — confirm they succeed and that
  the branded confirmation emails arrive (via the `MAIL_*` config on
  `shds-backend`).
- Visit `shds-admin`'s URL and log in with the account from step 4.

## Notes & troubleshooting

- **File uploads**: `shds-backend` has a persistent disk mounted at
  `/app/uploads` (see `render.yaml`) so donation payment screenshots
  survive redeploys. Without it, Render's filesystem is ephemeral.
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
