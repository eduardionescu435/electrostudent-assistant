from flask import session
from werkzeug.security import check_password_hash, generate_password_hash
from src.database.db import db
from .models import Admin


def login_controller(request_data):
    if not request_data:
        return {"message": "Request body is required"}, 400
    
    username = request_data.get("username")
    password = request_data.get("password")
    
    if not username or not password:
        return {"message": "Username and password are required"}, 400
    
    admin = Admin.query.filter_by(username=username).first()
    
    if not admin or not check_password_hash(admin.password, password):
        return {"message": "Invalid username or password"}, 401
    
    session["admin_id"] = admin.id
    session["username"] = admin.username
    
    return {"message": "Login successful", "username": admin.username}, 200


def get_me_controller():
    admin_id = session.get("admin_id")
    
    admin = Admin.query.get(admin_id)
    
    if not admin:
        return {"message": "Admin not found"}, 404
    
    return {"username": admin.username}, 200


def update_admin_controller(request_data):
    if not request_data:
        return {"message": "Request body is required"}, 400
    
    admin_id = session.get("admin_id")
    admin = Admin.query.get(admin_id)
    
    if not admin:
        return {"message": "Admin not found"}, 404
    
    new_username = request_data.get("username")
    new_password = request_data.get("password")
    
    if not new_username and not new_password:
        return {"message": "At least one field (username or password) is required"}, 400
    
    if new_username:
        existing_admin = Admin.query.filter_by(username=new_username).first()
        if existing_admin and existing_admin.id != admin_id:
            return {"message": "Username already exists"}, 409
        admin.username = new_username
        session["username"] = new_username
    
    if new_password:
        admin.password = generate_password_hash(new_password)
    
    db.session.commit()
    
    return {"message": "Admin updated successfully", "username": admin.username}, 200


def logout_controller():
    session.clear()
    return {"message": "Logout successful"}, 200


def register_controller(request_data):
    if not request_data:
        return {"message": "Request body is required"}, 400
    
    username = request_data.get("username")
    password = request_data.get("password")
    
    if not username or not password:
        return {"message": "Username and password are required"}, 400
    
    if len(username) < 3:
        return {"message": "Username must be at least 3 characters long"}, 400
    
    if len(password) < 6:
        return {"message": "Password must be at least 6 characters long"}, 400
    
    existing_admin = Admin.query.filter_by(username=username).first()
    if existing_admin:
        return {"message": "Username already exists"}, 409
    
    new_admin = Admin(
        username=username,
        password=generate_password_hash(password)
    )
    
    db.session.add(new_admin)
    db.session.commit()
    
    session["admin_id"] = new_admin.id
    session["username"] = new_admin.username
    
    return {"message": "Registration successful", "username": new_admin.username}, 201
