"""
Custom Flask CLI commands.

Usage:
    flask create-admin
"""

import click
from flask import Flask

from app.extensions import db
from app.models.admin import Admin
from app.models.enums import AdminRole


def register_cli(app: Flask) -> None:
    @app.cli.command("create-admin")
    @click.option("--name", prompt="Full name")
    @click.option("--email", prompt="Email")
    @click.option(
        "--password",
        prompt="Password",
        hide_input=True,
        confirmation_prompt=True,
    )
    def create_admin(name: str, email: str, password: str) -> None:
        """Create the first admin user (or promote an existing one)."""
        email = email.strip().lower()
        existing = Admin.query.filter_by(email=email).first()
        if existing:
            click.echo(f"An admin with email {email} already exists.")
            return

        admin = Admin(name=name, email=email, role=AdminRole.SUPERADMIN, is_active=True)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        click.echo(f"✅ Admin created: {email}")