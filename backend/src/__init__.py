import os
from flask import Flask, send_from_directory
from flask_session import Session
from flask_cors import CORS

from .config import Config
from .database.db import db, migrate


def create_app():

    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config.from_object(Config)

    # init CORS
    CORS(app, supports_credentials=True, origins=[app.config["FRONTEND_URL"]])

    # init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    Session(app)

    # import models
    from .features.auth import models
    from .features.components import models

    # register routes
    from .features.auth.routes import auth_bp
    from .features.components.routes import components_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(components_bp, url_prefix="/api/components")

    # Upload configuration
    upload_folder = os.path.join(app.root_path, '..', 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    app.config['UPLOAD_FOLDER'] = upload_folder

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route("/")
    def welcome():
        return {"message": "Welcome to the Electro Student Assistant API"}

    return app
