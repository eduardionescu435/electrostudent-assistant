from flask import Blueprint
from .controller import (
    get_components_controller,
    get_component_by_id_controller,
    create_component_controller,
    update_component_controller,
    delete_component_controller,
    analyze_image_controller,
    get_stats_controller
)
from src.utils.auth import auth_required

components_bp = Blueprint('components', __name__)

@components_bp.route('', methods=['GET'])
@auth_required
def get_components():
    return get_components_controller()

@components_bp.route('/stats', methods=['GET'])
@auth_required
def get_stats():
    return get_stats_controller()

@components_bp.route('/analyze-image', methods=['POST'])
@auth_required
def analyze_image():
    return analyze_image_controller()

@components_bp.route('/<int:component_id>', methods=['GET'])
@auth_required
def get_component(component_id):
    return get_component_by_id_controller(component_id)

@components_bp.route('', methods=['POST'])
@auth_required
def create_component():
    return create_component_controller()

@components_bp.route('/<int:component_id>', methods=['PATCH'])
@auth_required
def update_component(component_id):
    return update_component_controller(component_id)

@components_bp.route('/<int:component_id>', methods=['DELETE'])
@auth_required
def delete_component(component_id):
    return delete_component_controller(component_id)
