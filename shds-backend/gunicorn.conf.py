"""Gunicorn production config. Tune `workers` for your host's CPU count."""

import multiprocessing
import os

bind = f"0.0.0.0:{os.getenv('PORT', 5000)}"
workers = int(os.getenv("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))
worker_class = "sync"
timeout = 30
graceful_timeout = 30
keepalive = 5
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info").lower()
