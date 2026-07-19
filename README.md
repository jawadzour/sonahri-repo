# SHDS Website — Setup Guide

Full-stack website: React + Vite (frontend), Express + tRPC (backend), Drizzle ORM + MySQL (database).

## 1. Install dependencies

```bash
npm install -g pnpm
pnpm install
```

## 2. Setup local database (XAMPP)

1. Open XAMPP Control Panel → Start **MySQL**.
2. Go to `http://localhost/phpmyadmin` → create a new database named `shds_website`.

## 3. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:
- `DATABASE_URL` → already set for default XAMPP (`root`, no password). Change if yours differs.
- `JWT_SECRET` → any random long string.
- `ADMIN_EMAIL` → the email you'll log in with at `/admin/login`.
- `ADMIN_PASSWORD_HASH` → generate it:
  ```bash
  node scripts/generate-password-hash.mjs "your-chosen-password"
  ```
  Copy the printed line into `.env`.
- `SMTP_*` → (optional, for contact form email notifications) use Gmail SMTP with an [App Password](https://myaccount.google.com/apppasswords), or any SMTP provider (Brevo, SendGrid, etc). Leave blank to skip email notifications — form submissions still get saved to the database either way.

## 4. Create database tables

```bash
pnpm db:push
```

## 5. Run locally

```bash
pnpm dev
```

Open **http://localhost:3000**

Admin panel: **http://localhost:3000/admin/login**

## 6. Production build

```bash
pnpm build
pnpm start
```

## Project structure

- `client/src/pages/` — Home, About, Programs, Projects, Impact, Governance, Gallery, Contact
- `client/src/pages/AdminLogin.tsx`, `AdminDashboard.tsx` — simple admin panel to view contact form submissions
- `server/routers.ts` — API routes (tRPC): `auth`, `contact`, `admin`
- `drizzle/schema.ts` — database tables (currently: `inquiries` for contact form)
- `server/_core/auth.ts` — admin login/session logic (JWT cookie, no third-party OAuth)
- `server/_core/mailer.ts` — sends email notification when someone submits the contact form

## Deployment (client hosting)

This is a Node.js app (not static), so it needs a Node-capable host:
- **Render.com** or **Railway.app** — easiest, free/cheap tier, supports Node + MySQL
- A VPS (DigitalOcean, Hostinger VPS) if you want full control

On the host, set the same environment variables as `.env`, point `DATABASE_URL` to the production MySQL (Railway/PlanetScale/your host's MySQL), run `pnpm build` then `pnpm start`.

## Adding more content/tables

- To add a new database table (e.g. team members, events), edit `drizzle/schema.ts`, then run `pnpm db:push` again.
- To add a new API route, edit `server/routers.ts`.
