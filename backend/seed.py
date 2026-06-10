import os
from werkzeug.security import generate_password_hash
from src import create_app
from src.database.db import db
from src.features.auth.models import Admin


def seed_admin():
    """Seed the database with an admin user from environment variables."""
    app = create_app()
    
    with app.app_context():
        admin_username = os.getenv("ADMIN_USERNAME")
        admin_password = os.getenv("ADMIN_PASSWORD")
        
        if not admin_username or not admin_password:
            print("Error: ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env file")
            return
        
        user_count = Admin.query.count()
        
        if user_count > 0:
            print(f"Users already exist in the database (count: {user_count}). Skipping seed...")
            return
        
        hashed_password = generate_password_hash(admin_password)
        new_admin = Admin(
            username=admin_username,
            password=hashed_password
        )
        
        db.session.add(new_admin)
        db.session.commit()
        
        print(f"Admin user '{admin_username}' created successfully!")


if __name__ == "__main__":
    seed_admin()
