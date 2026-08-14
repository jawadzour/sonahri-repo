# SHDS Website — Setup Guide

Full-stack website: React + Vite (frontend), Express + tRPC (backend).
This app is stateless — it has no database of its own. The Contact and
Donate forms, and all admin-managed content, are served by the separate
`shds-backend` Flask API (see `DEPLOY_RENDER.md`).

## 1. Install dependencies

```bash
npm install -g pnpm
pnpm install
```

## 2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The defaults (`NODE_ENV`, `PORT`) work as-is for local development.

## 3. Run locally

```bash
pnpm dev
```

Open **http://localhost:3000**

## 4. Production build

```bash
pnpm build
pnpm start
```

## Project structure

- `client/src/pages/` — Home, About, Programs, Projects, Impact, Governance, Gallery, Donate, Contact
- `client/src/lib/shds-api.ts` — client for the `shds-backend` Flask API (contact form, donations, public content)
- `server/routers.ts` — API routes (tRPC), currently just a `system.health` check
- `server/_core/` — Express + tRPC server scaffolding

## Deployment

See `DEPLOY_RENDER.md` for the full three-service Render deployment
(this site, the Flask backend, and the standalone admin panel).
