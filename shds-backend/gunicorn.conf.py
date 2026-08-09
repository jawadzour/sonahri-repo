"""Gunicorn production config. Tune `workers` for your host's CPU count."""

import multiprocessing
import os

bind = f"0.0.0.0:{os.getenv('PORT', 5000)}"
# Capped at 4: `cpu_count() * 2 + 1` reports the *host's* core count on
# shared/containerized platforms (e.g. Render's free tier), not the
# container's actual CPU/memory allocation - on a 512MB instance that
# formula spawns enough workers to OOM before the first request lands.
workers = int(os.getenv("GUNICORN_WORKERS", min(multiprocessing.cpu_count() * 2 + 1, 4)))
worker_class = "sync"
timeout = 30
graceful_timeout = 30
keepalive = 5
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info").lower()
