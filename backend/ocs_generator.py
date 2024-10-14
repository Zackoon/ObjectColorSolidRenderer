from chromalab.observer import Observer
from chromalab.spectra import Spectra
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
# %matplotlib widget

def generate_OCS():
    # Cone responses of a typical trichromat.
    standard_trichromat = Observer.trichromat(np.arange(390, 701, 3))

    # Assumes an indicator reflectance function where R = 1 at a single wavelength and 0 elsewhere,
    # and an illumination 1 everywhere.
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

    # Convert quads to triangles
    triangle_faces = []

    for quad in faces:
        tri1 = [quad[0], quad[1], quad[2]]
        tri2 = [quad[0], quad[2], quad[3]]
        triangle_faces.append(tri1)
        triangle_faces.append(tri2)

    triangle_faces = np.array(triangle_faces)

    # Create unique vertices and indices
    vertices_flat = triangle_faces.reshape(-1, 3)
    unique_vertices, indices = np.unique(vertices_flat, axis=0, return_inverse=True)
    triangle_indices = indices.reshape(-1, 3)

    # Normalize unique_vertices to 0-1 range
    min_coords = np.min(unique_vertices, axis=0)
    max_coords = np.max(unique_vertices, axis=0)
    range_coords = max_coords - min_coords

    normalized_vertices = (unique_vertices - min_coords) / range_coords

    # Compute colors per quad and assign to triangles
    colors_per_quad = []
    max_x = np.max(faces[:, :, 0])
    max_y = np.max(faces[:, :, 1])
    max_z = np.max(faces[:, :, 2])

    for quad in faces:
        r = np.mean(quad[:, 0]) / max_x
        g = np.mean(quad[:, 1]) / max_y
        b = np.mean(quad[:, 2]) / max_z
        colors_per_quad.append([r, g, b])

    colors_per_triangle = []
    for color in colors_per_quad:
        colors_per_triangle.append(color)
        colors_per_triangle.append(color)

    colors_per_triangle = np.array(colors_per_triangle)

    print(normalized_vertices.shape)
    print(triangle_indices.shape)
    print(colors_per_triangle.shape)
    print(np.max(colors_per_triangle), np.min(colors_per_triangle))

    return normalized_vertices.tolist(), triangle_indices.tolist(), colors_per_triangle.tolist()
