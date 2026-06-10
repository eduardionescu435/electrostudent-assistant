import os
import json
from flask import request, jsonify, current_app, session
from src.database.db import db
from .models import Component
import uuid
from werkzeug.utils import secure_filename
from google import genai
from google.genai import types


def get_components_controller():
    search = request.args.get("search", "")
    category = request.args.get("category", "")

    query = Component.query.filter_by(admin_id=session.get("admin_id"))

    if search:
        query = query.filter(
            (Component.name.ilike(f"%{search}%"))
            | (Component.identification_code.ilike(f"%{search}%"))
            | (Component.manufacturer.ilike(f"%{search}%"))
        )

    if category:
        query = query.filter(Component.category == category)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = query.order_by(Component.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return (
        jsonify(
            {
                "components": [c.to_dict() for c in pagination.items],
                "total": pagination.total,
                "page": pagination.page,
                "per_page": pagination.per_page,
                "total_pages": pagination.pages,
            }
        ),
        200,
    )


def get_component_by_id_controller(component_id):
    component = Component.query.filter_by(id=component_id, admin_id=session.get("admin_id")).first()
    if not component:
        return jsonify({"message": "Component not found"}), 404
    return jsonify(component.to_dict()), 200


def handle_file_upload(file, folder="uploads"):
    if not file or file.filename == "":
        return None

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], unique_filename)
    file.save(file_path)
    return f"/uploads/{unique_filename}"


def create_component_controller():
    data = request.get_json(silent=True) or request.form.to_dict()

    if not data or not data.get("name"):
        return jsonify({"message": "Name is required"}), 400

    image_url = data.get("image_url")
    if "image" in request.files:
        image_url = handle_file_upload(request.files["image"])
        
    datasheet_url = data.get("datasheet_url")
    if "datasheet" in request.files:
        datasheet_url = handle_file_upload(request.files["datasheet"])

    ident_code = data.get("identification_code")
    if ident_code == "":
        ident_code = None

    new_component = Component(
        admin_id=session.get("admin_id"),
        name=data.get("name"),
        category=data.get("category"),
        manufacturer=data.get("manufacturer"),
        identification_code=ident_code,
        quantity=int(data.get("quantity", 0)) if data.get("quantity") else 0,
        location=data.get("location"),
        image_url=image_url,
        datasheet_url=datasheet_url,
        notes=data.get("notes"),
        pinout_data=(
            json.loads(data.get("pinout_data"))
            if isinstance(data.get("pinout_data"), str)
            else data.get("pinout_data")
        ),
    )

    try:
        db.session.add(new_component)
        db.session.commit()
        return jsonify(new_component.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        error_msg = str(e)
        if "Duplicate entry" in error_msg:
            field = "ID code" if "identification_code" in error_msg else "item"
            return (
                jsonify(
                    {
                        "message": f"Conflict: A component with this {field} already exists."
                    }
                ),
                400,
            )
        return (
            jsonify(
                {"message": "An unexpected error occurred while saving the component."}
            ),
            500,
        )


def update_component_controller(component_id):
    component = Component.query.filter_by(id=component_id, admin_id=session.get("admin_id")).first()
    if not component:
        return jsonify({"message": "Component not found"}), 404

    data = request.get_json(silent=True) or request.form.to_dict()

    if not data and not request.files:
        return jsonify({"message": "No data provided"}), 400

    if "image" in request.files:
        if component.image_url:
            old_path = os.path.join(current_app.config["UPLOAD_FOLDER"], component.image_url.split('/')[-1])
            if os.path.exists(old_path):
                try: os.remove(old_path)
                except: pass
        component.image_url = handle_file_upload(request.files["image"])
    elif "image_url" in data and data["image_url"] == "":
        if component.image_url:
            old_path = os.path.join(current_app.config["UPLOAD_FOLDER"], component.image_url.split('/')[-1])
            if os.path.exists(old_path):
                try: os.remove(old_path)
                except: pass
        component.image_url = None
    elif "image_url" in data:
        component.image_url = data["image_url"]

    if "datasheet" in request.files:
        if component.datasheet_url:
            old_path = os.path.join(current_app.config["UPLOAD_FOLDER"], component.datasheet_url.split('/')[-1])
            if os.path.exists(old_path):
                try: os.remove(old_path)
                except: pass
        component.datasheet_url = handle_file_upload(request.files["datasheet"])
    elif "datasheet_url" in data and data["datasheet_url"] == "":
        if component.datasheet_url:
            old_path = os.path.join(current_app.config["UPLOAD_FOLDER"], component.datasheet_url.split('/')[-1])
            if os.path.exists(old_path):
                try: os.remove(old_path)
                except: pass
        component.datasheet_url = None
    elif "datasheet_url" in data:
        component.datasheet_url = data["datasheet_url"]

    if "name" in data:
        component.name = data["name"]
    if "category" in data:
        component.category = data["category"]
    if "manufacturer" in data:
        component.manufacturer = data["manufacturer"]
    if "identification_code" in data:
        ident_code = data["identification_code"]
        component.identification_code = ident_code if ident_code != "" else None

    if "quantity" in data:
        qty = data["quantity"]
        component.quantity = int(qty) if qty else 0

    if "location" in data:
        component.location = data["location"]
    if "notes" in data:
        component.notes = data["notes"]
    if "pinout_data" in data:
        component.pinout_data = (
            json.loads(data["pinout_data"])
            if isinstance(data["pinout_data"], str)
            else data["pinout_data"]
        )

    try:
        db.session.commit()
        return jsonify(component.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        error_msg = str(e)
        if "Duplicate entry" in error_msg:
            field = "ID code" if "identification_code" in error_msg else "item"
            return (
                jsonify(
                    {
                        "message": f"Conflict: A component with this {field} already exists."
                    }
                ),
                400,
            )
        return (
            jsonify(
                {
                    "message": "An unexpected error occurred while updating the component."
                }
            ),
            500,
        )


def delete_component_controller(component_id):
    component = Component.query.filter_by(id=component_id, admin_id=session.get("admin_id")).first()
    if not component:
        return jsonify({"message": "Component not found"}), 404

    try:
        if component.image_url:
            filename = component.image_url.split('/')[-1]
            file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                
        if component.datasheet_url:
            filename = component.datasheet_url.split('/')[-1]
            file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
            if os.path.exists(file_path):
                os.remove(file_path)
    except Exception:
        pass

    try:
        db.session.delete(component)
        db.session.commit()
        return jsonify({"message": "Component deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


def analyze_image_controller():
    if "image" not in request.files:
        return jsonify({"message": "No image file provided"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    prompt = """
    Identify the electronic component in this photo.
    Extract the following details and return as a VALID JSON object:
    - name: Part number or common name (e.g., NE555, 2N2222, 10k Resistor)
    - category: Must be one of: IC, Resistor, Capacitor, Transistor, Diode, Sensor, Module
    - manufacturer: e.g., Texas Instruments, ST, Philips, etc.
    - identification_code: Any barcode, QR, or unique marking visible.
    - quantity: Count of the components visible or the quantity written on the label.
    
    Rules:
    1. If a field is not found, use null.
    2. Return ONLY the JSON object.
    3. Ensure category is exactly from the allowed list.
    4. quantity should be an integer.
    """

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=[
                types.Part.from_bytes(
                    data=image_bytes, mime_type=image_file.content_type
                ),
                prompt,
            ],
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )

        result = json.loads(response.text)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

def get_stats_controller():
    admin_id = session.get("admin_id")
    total_components = Component.query.filter_by(admin_id=admin_id).count()
    low_stock = Component.query.filter_by(admin_id=admin_id).filter(Component.quantity < 5).count()
    datasheets_count = Component.query.filter_by(admin_id=admin_id).filter(Component.datasheet_url.isnot(None)).filter(Component.datasheet_url != "").count()
    
    categories_raw = db.session.query(Component.category, db.func.count(Component.id)).filter(Component.admin_id == admin_id).group_by(Component.category).all()
    categories_stats = [{"name": cat or "General", "value": count} for cat, count in categories_raw]
    
    return jsonify({
        "total_components": total_components,
        "low_stock": low_stock,
        "datasheets_count": datasheets_count,
        "categories_stats": categories_stats
    }), 200
