from flask import request, Blueprint
from src.utils.utils import login_required
from .controller import login_controller, get_me_controller, update_admin_controller, logout_controller, register_controller

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    return register_controller(request.get_json(silent=True))


@auth_bp.route("/login", methods=["POST"])
def login():
    return login_controller(request.get_json(silent=True))


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    return logout_controller()


@auth_bp.route("/me", methods=["GET"])
@login_required
def get_me():
    return get_me_controller()


@auth_bp.route("/me", methods=["PATCH"])
@login_required
def update_admin():
    return update_admin_controller(request.get_json(silent=True))
