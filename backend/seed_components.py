"""
seed_components.py
Seeds 20 components from a pre-built SQL file + copies uploaded assets.
"""

import os
import shutil
import sys

from src import create_app
from src.database.db import db
from src.features.components.models import Component

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_DIR = os.path.join(BASE_DIR, "seed_data")
SQL_FILE = os.path.join(SEED_DIR, "components.sql")


def _uploads_dir(app) -> str:
    uploads = os.path.join(app.root_path, "..", "uploads")
    os.makedirs(uploads, exist_ok=True)
    return os.path.abspath(uploads)


def seed_components():
    app = create_app()

    with app.app_context():
        count = db.session.query(Component).count()
        if count > 0:
            print(f"Skipping component seed: {count} already exist.")
            return

        uploads = _uploads_dir(app)

        if not os.path.isdir(SEED_DIR):
            print(f"Error: seed_data/ not found at {SEED_DIR}")
            sys.exit(1)

        print(f"Populating uploads from seed_data...")
        copied = 0
        skipped = 0
        for fname in os.listdir(SEED_DIR):
            if fname == "components.sql":
                continue
            src = os.path.join(SEED_DIR, fname)
            dest = os.path.join(uploads, fname)
            if os.path.isfile(src):
                if os.path.exists(dest):
                    skipped += 1
                else:
                    shutil.copy2(src, dest)
                    copied += 1

        print(f"Files: {copied} copied, {skipped} skipped.")

        if not os.path.isfile(SQL_FILE):
            print(f"Error: SQL file not found: {SQL_FILE}")
            sys.exit(1)

        print(f"Importing {SQL_FILE}...")
        with open(SQL_FILE, "r", encoding="utf-8") as f:
            sql = f.read()

        from src.features.auth.models import Admin
        main_admin = Admin.query.order_by(Admin.id.asc()).first()
        if not main_admin:
            print("Error: No admin user found. Please run seed.py first.")
            sys.exit(1)

        statements = [
            line
            for line in sql.splitlines()
            if line.strip() and not line.strip().startswith("--")
        ]
        sql_clean = "\n".join(statements)
        
        sql_clean = sql_clean.replace(
            "(name, category,", 
            "(admin_id, name, category,"
        )
        sql_clean = sql_clean.replace("  ('", f"  ({main_admin.id}, '")

        try:
            db.session.execute(db.text(sql_clean))
            db.session.commit()
        except Exception as exc:
            db.session.rollback()
            print(f"SQL import failed: {exc}")
            sys.exit(1)

        final_count = db.session.query(Component).count()
        print(f"Seeded {final_count} components successfully.")


if __name__ == "__main__":
    seed_components()
