"""
Application configuration.

Configuration is driven entirely by environment variables (see .env.example).
Never hardcode secrets here — this file only defines *how* config is loaded,
not the values themselves.
"""

import os
from datetime import timedelta

from dotenv import load_dotenv

# Load .env before anything reads os.environ
load_dotenv()


def _bool_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _list_env(name: str, default: str = "") -> list[str]:
    raw = os.getenv(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


class BaseConfig:
    """Shared configuration across all environments."""

    # --- Core ---
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-secret-change-me")
    APP_CONFIG = os.getenv("APP_CONFIG", "development")

    # --- Database ---
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = _bool_env("SQLALCHEMY_ECHO", False)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": int(os.getenv("SQLALCHEMY_POOL_SIZE", 10)),
        "max_overflow": int(os.getenv("SQLALCHEMY_MAX_OVERFLOW", 20)),
        "pool_timeout": int(os.getenv("SQLALCHEMY_POOL_TIMEOUT", 30)),
        "pool_recycle": int(os.getenv("SQLALCHEMY_POOL_RECYCLE", 1800)),
        # Verifies connections are alive before use — important for
        # long-lived pooled connections behind load balancers / proxies.
        "pool_pre_ping": True,
    }

    # --- JWT ---
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-insecure-jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 15))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 30))
    )
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_COOKIE_SECURE = _bool_env("JWT_COOKIE_SECURE", False)

    # --- CORS ---
    CORS_ORIGINS = _list_env("CORS_ORIGINS", "http://localhost:5173")

    # --- Rate limiting ---
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    # --- File uploads (Media Library) ---
    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER", os.path.join(os.getcwd(), "uploads")
    )
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_UPLOAD_SIZE_MB", 20)) * 1024 * 1024
    ALLOWED_UPLOAD_EXTENSIONS = {
        "png", "jpg", "jpeg", "webp", "gif", "svg",
        "pdf", "doc", "docx", "xls", "xlsx",
    }
    # Base URL used to build absolute file URLs returned to the frontend.
    BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")
    ADMIN_FRONTEND_URL = os.getenv("ADMIN_FRONTEND_URL", "http://localhost:5174")
    
    # --- Email (confirmation emails) ---
    MAIL_ENABLED = os.getenv("MAIL_ENABLED", "False").lower() in {"1", "true", "yes"}
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True").lower() in {"1", "true", "yes"}
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", MAIL_USERNAME)

    # --- Pagination defaults (used later by feature endpoints) ---
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100

    # --- Logging ---
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    # --- JSON formatting ---
    JSONIFY_PRETTYPRINT_REGULAR = False
    JSON_SORT_KEYS = False


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = False
    SQLALCHEMY_ECHO = _bool_env("SQLALCHEMY_ECHO", True)


class TestingConfig(BaseConfig):
    DEBUG = False
    TESTING = True
    # Tests should never touch the real database. Override via env if needed,
    # otherwise fall back to an in-memory SQLite DB for fast, isolated tests.
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URL", "sqlite:///:memory:"
    )
    # SQLite (used for fast local tests) doesn't support the Postgres-oriented
    # pooling options in BaseConfig, so tests get a clean engine config.
    SQLALCHEMY_ENGINE_OPTIONS = {}
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_ECHO = False
    JWT_COOKIE_SECURE = True


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(name: str | None = None):
    """Resolve a config class by name, falling back to APP_CONFIG / development."""
    key = (name or os.getenv("APP_CONFIG") or "development").lower()
    return CONFIG_MAP.get(key, DevelopmentConfig)
