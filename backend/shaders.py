# note, these shaders are run in @react-three/drei, they are not raw GLSL
# TODO: move these to res/shaders

def get_vertex_shader():
    return """
    varying vec3 vNormal;
    varying vec3 vColor;

    attribute vec3 color;  // Declare 'color' as an attribute

    void main() {
      vNormal = normal;
      vColor = color;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    """

def get_fragment_shader():
    return """
    uniform vec3 col;
    varying vec3 vColor;
    varying vec3 vNormal;
    void main() {
      vec3 light = vec3(0.5, 0.2, 1.0);
      light = normalize(light);
      float dProd = max(0.0, dot(vNormal, light));
      //dProd = 1.0;
      gl_FragColor = vec4((col * 0.01) + (vColor * dProd), 1.0);
    }
    """