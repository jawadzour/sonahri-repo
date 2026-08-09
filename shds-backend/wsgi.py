"""
WSGI entrypoint.

- `flask run` / `flask db ...` use this via FLASK_APP=wsgi.py (see .flaskenv).
- Production: `gunicorn -c gunicorn.conf.py wsgi:app`
"""

import os

from app import create_app

app = create_app(os.getenv("APP_CONFIG"))

if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 5000)),
    )
