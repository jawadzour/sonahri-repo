# SHDS Backend

Production-ready Flask backend architecture for the SHDS website. This
repo is **structure and configuration only** — no business logic /
features are implemented yet. It's meant to sit alongside the existing
frontend (`shds_website`) as its new API, replacing the old Node/tRPC
server without requiring any frontend changes to compile.

## Stack

- **Flask 3** — application factory pattern
- **PostgreSQL** + **SQLAlchemy 2** — ORM, connection pooling configured
- **Flask-Migrate** (Alembic) — schema migrations
- **Flask-JWT-Extended** — JWT authentication (access + refresh tokens)
- **Flask-CORS** — cross-origin support for the separately-hosted frontend
- **Flask-Limiter** — rate limiting (e.g. brute-force protection on auth)
- **Marshmallow** — request/response (de)serialization, once features land
- **python-dotenv** — `.env`-based configuration
- **Gunicorn** — production WSGI server

## Project layout

```
shds-backend/
├── app/
│   ├── __init__.py            # create_app() application factory
│   ├── config.py              # env-driven config classes (dev/test/prod)
│   ├── extensions.py          # shared extension instances (db, jwt, cors, ...)
│   ├── models/
│   │   ├── __init__.py        # model registry (import new models here)
│   │   └── base.py            # BaseModel: id, created_at, updated_at
│   ├── api/
│   │   ├── __init__.py        # register_api() mounts versioned blueprints
│   │   └── v1/
│   │       ├── __init__.py    # composes feature blueprints under /api/v1
│   │       ├── health/        # GET /api/v1/health/ (implemented)
│   │       ├── auth/          # /api/v1/auth/* (stubbed, JWT wired)
│   │       └── inquiries/     # /api/v1/inquiries/* (stubbed — contact form)
│   └── utils/
│       ├── responses.py       # success()/error()/paginated() envelopes
│       └── errors.py          # APIError hierarchy + centralized handlers
├── migrations/                 # Alembic migration environment (flask db init already run)
├── tests/
│   ├── conftest.py             # app/client fixtures using TestingConfig
│   └── test_health.py
├── wsgi.py                     # app entrypoint (flask CLI + gunicorn)
├── gunicorn.conf.py
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── docker-compose.yml           # app + postgres for local/prod-like runs
├── .env.example
└── .flaskenv
```

## Design notes

- **App factory + blueprints**: `create_app()` in `app/__init__.py` avoids
  a module-level `Flask()` instance, so tests can spin up isolated apps
  with `create_app("testing")` and there's no import-order footgun
  between extensions, models, and routes.
- **API versioning**: everything is mounted under `/api/v1/...` from day
  one, so a future `/api/v2/` can be added without breaking existing
  frontend calls.
- **Feature isolation**: each domain (`auth`, `inquiries`, and future ones
  like `programs`, `projects`, `gallery`) gets its own sub-package under
  `app/api/v1/`. Add `schemas.py` / `services.py` alongside `routes.py`
  inside a feature folder as it's implemented.
- **Consistent envelopes**: `app/utils/responses.py` and
  `app/utils/errors.py` define one JSON response shape
  (`{success, data|message, ...}`) for the whole API, enforced through a
  centralized error handler rather than per-route try/except blocks.
- **Config by environment**: `APP_CONFIG=development|testing|production`
  selects the config class in `app/config.py`; every secret and tunable
  comes from `.env` (see `.env.example`), never hardcoded.
- **Connection pooling**: `SQLALCHEMY_ENGINE_OPTIONS` sets pool size,
  overflow, timeout, recycle, and `pool_pre_ping` — tuned via env vars for
  horizontal scaling behind a load balancer.
- **Auth is wired, not implemented**: `JWTManager` is fully configured
  (secret, token lifetimes, header format) and `app/api/v1/auth/routes.py`
  has the blueprint + commented route stubs matching the frontend's
  existing `auth.login` / `auth.logout` / `auth.me` calls — ready to fill
  in without touching app-level config.
- **Inquiries stub mirrors the frontend**: `app/api/v1/inquiries/`
  mirrors the contact-form domain already used by
  `client/src/pages/Contact.tsx` and `AdminDashboard.tsx`, so implementing
  it later is a drop-in.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate        # .venv\Scripts\activate on Windows
pip install -r requirements-dev.txt

cp .env.example .env              # then edit .env with real values

# Start Postgres however you prefer, e.g.:
docker compose up -d db

flask db upgrade                  # applies migrations (none yet — models pending)
flask run                         # http://localhost:5000
```

Run tests (uses an in-memory SQLite DB, no Postgres needed):

```bash
pytest
```

## Docker (app + Postgres together)

```bash
cp .env.example .env              # edit as needed
docker compose up --build
```

## Adding a new feature (once you start implementing)

1. Create `app/models/<name>.py` inheriting `BaseModel`; import it in
   `app/models/__init__.py`.
2. Create `app/api/v1/<name>/{__init__.py,routes.py}` with a blueprint.
3. Register it in `app/api/v1/__init__.py`.
4. `flask db migrate -m "add <name> table"` then `flask db upgrade`.
