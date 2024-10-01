from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import pywavefront

app = Flask(__name__)
CORS(app)

@app.route('/get_teapot_data', methods=['GET'])
def get_teapot_data():
    """Fetch teapot 3D model data, calculate normals, and return shaders"""
    scene = pywavefront.Wavefront('../res/teapot.obj', collect_faces=True)

    # Extract vertices and faces
    vertices = scene.vertices
    faces = [face for mesh in scene.mesh_list for face in mesh.faces]

    # Calculate vertex normals
    normals = calculate_normals(vertices, faces)

    # Shaders
    vertex_shader = """
    varying vec3 vNormal;
    void main() {
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    """

    fragment_shader = """
    uniform vec3 color;
    varying vec3 vNormal;
    void main() {
      vec3 light = vec3(0.5, 0.2, 1.0);
      light = normalize(light);
      float dProd = max(0.0, dot(vNormal, light));
      gl_FragColor = vec4(color * dProd, 1.0);
    }
    """

    return jsonify({
        'vertices': vertices,
        'faces': faces,
        'normals': normals,
        'vertexShader': vertex_shader,
        'fragmentShader': fragment_shader
    })

def calculate_normals(vertices, faces):
    """Calculate normals for each vertex based on the faces"""
    normals = np.zeros_like(vertices)
    
    for face in faces:
        v0, v1, v2 = [np.array(vertices[i]) for i in face]
        normal = np.cross(v1 - v0, v2 - v0)
        
        for i in face:
            normals[i] += normal
    
    # Normalize the result
    return (normals / np.linalg.norm(normals, axis=1)[:, np.newaxis]).tolist()

if __name__ == '__main__':
    app.run(debug=True)
