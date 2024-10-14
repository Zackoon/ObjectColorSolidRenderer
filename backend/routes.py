import numpy as np

from flask import Blueprint, jsonify
from model_utils import load_obj, calculate_normals
from ocs_generator import generate_OCS
from shaders import get_vertex_shader, get_fragment_shader

teapot_routes = Blueprint('teapot_routes', __name__)
ocs_routes = Blueprint('ocs_routes', __name__)

@ocs_routes.route('/get_ocs_data', methods=['GET'])
def get_ocs_data():
    """Generate object color solid geometry, colors, normals, and return shaders"""

    print("generating ocs")
    vertices, indices, colors = generate_OCS()
    normals = calculate_normals(vertices, indices)

    return jsonify({
        'vertices': vertices,
        'indices': indices,
        'normals': normals,
        'colors': colors,
        'vertexShader': get_vertex_shader(),
        'fragmentShader': get_fragment_shader()
    })

@teapot_routes.route('/get_teapot_data', methods=['GET'])
def get_teapot_data():
    """Fetch teapot 3D model data, calculate normals, and return shaders"""

    vertices, indices = load_obj('res/models/teapot.obj')
    normals = calculate_normals(vertices, indices)
    colors = [0.5, 0.5, 0.5] * len(vertices)

    return jsonify({
        'vertices': vertices,
        'indices': indices,
        'normals': normals,
        'colors': colors,
        'vertexShader': get_vertex_shader(),
        'fragmentShader': get_fragment_shader()
    })