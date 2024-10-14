from chromalab.observer import Observer
from chromalab.spectra import Spectra
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
#%matplotlib widget

def quads_to_triangles(quads: np.ndarray) -> np.ndarray:
    """
    Convert an array of quads (n, 4, 3) to an array of triangles (2n, 3, 3).
    
    Parameters:
    quads (np.ndarray): An array of shape (n, 4, 3) where n is the number of quads, 
                        each quad has 4 vertices in 3D space.
                        
    Returns:
    np.ndarray: An array of shape (2n, 3, 3) containing triangles formed from the quads.
    """
    # Ensure input is the correct shape
    assert quads.shape[1:] == (4, 3), "Input array must have shape (n, 4, 3)"
    
    # Number of quads
    n = quads.shape[0]
    
    # First triangle for each quad: [v0, v1, v2]
    triangles_1 = quads[:, [0, 1, 2]]
    
    # Second triangle for each quad: [v0, v2, v3]
    triangles_2 = quads[:, [0, 2, 3]]
    
    # Stack the two sets of triangles together along the first axis
    triangles = np.vstack((triangles_1, triangles_2))
    
    return triangles

import numpy as np

def triangles_to_vertices_indices(triangles: np.ndarray):
    """
    Convert a list of triangles into a list of unique vertices and their indices.
    
    Parameters:
    triangles (np.ndarray): An array of shape (n, 3, 3) where n is the number of triangles,
                            each triangle has 3 vertices in 3D space.
                            
    Returns:
    tuple: A tuple containing:
        - vertices (np.ndarray): An array of unique vertices of shape (m, 3), where m is the number of unique vertices.
        - indices (np.ndarray): An array of shape (n, 3) representing the indices of the triangles in the vertex list.
    """
    # Dictionary to store unique vertices and their corresponding indices
    vertex_to_index = {}
    vertices = []
    indices = []

    # Iterate through all triangles
    for triangle in triangles:
        triangle_indices = []
        for vertex in triangle:
            # Convert the vertex (numpy array) to a tuple so it can be used as a dictionary key
            vertex_tuple = tuple(vertex)
            if vertex_tuple not in vertex_to_index:
                # Assign a new index if the vertex is not already in the dictionary
                vertex_to_index[vertex_tuple] = len(vertices)
                vertices.append(vertex_tuple)
            # Append the index of the vertex for this triangle
            triangle_indices.append(vertex_to_index[vertex_tuple])
        # Append the triangle indices
        indices.append(triangle_indices)
    
    # Convert the list of vertices and indices to numpy arrays
    vertices = np.array(vertices)
    indices = np.array(indices)
    
    return vertices, indices

def generate_OCS():
    # Cone responses of a typical trichromat.
    standard_trichromat = Observer.trichromat(np.arange(390, 701, 3))

    # Assumes an indicator reflectance function where R = 1 at a single wavelength and 0 elsewhere,
    # and an illumination 1 everywhere.
    # This represents equations (9), (10), (11), (12), (13).
    points = np.vstack((standard_trichromat.sensors[0].data, 
                        standard_trichromat.sensors[1].data, 
                        standard_trichromat.sensors[2].data)).T
    points /= np.sum(standard_trichromat.sensors[1].data)

    n = points.shape[0]
    vertices = np.zeros((n + 1, n, 3))
    # This represents the matrix in (7).
    for i in range(1, n + 1):
        for j in range(n):
            vertices[i, j] = vertices[i - 1, j] + points[(i + j - 1) % n]
    faces = np.zeros((n * (n - 1), 4, 3))
    # This represents the diagram in (8)
    for i in range(1, n):
        for j in range(n):
            faces[((i - 1) * n) + j, 0] = vertices[i, j]
            faces[((i - 1) * n) + j, 1] = vertices[i - 1, (j + 1) % n]
            faces[((i - 1) * n) + j, 2] = vertices[i, (j + 1) % n]
            faces[((i - 1) * n) + j, 3] = vertices[i + 1, j]

    # The color of each face is a function of the coordinates of its center.
    # TODO: This isn't an accurate representation of the solid's color at a point, need to find a more accurate representation.
    colors = []
    max_x = np.max(faces[:, :, 0])
    max_y = np.max(faces[:, :, 1])
    max_z = np.max(faces[:, :, 2])
    for face in faces:
        r = np.mean(face[:, 0]) / max_x
        g = np.mean(face[:, 1]) / max_y
        b = np.mean(face[:, 2]) / max_z
        colors.append([r, g, b])

    tris = quads_to_triangles(faces)
    vertices, indices = triangles_to_vertices_indices(tris)

    return vertices.tolist(), indices.tolist(), colors