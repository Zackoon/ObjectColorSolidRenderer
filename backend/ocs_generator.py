from chromalab.observer import Observer
from chromalab.spectra import Spectra
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
#%matplotlib widget

import pandas as pd

def read_cone_response(csv_file_path):
    # First, try to read the file without a header

    df = None
    try:
        df = pd.read_csv(csv_file_path, header=None)
    except FileNotFoundError:
        print("File not found!")
        return None, None, None, None
    except:
        print("File not found!")
        return None, None, None, None
    
    # Check if the first value in the file is numeric to determine if there's a header
    try:
        float(df.iloc[0, 0])  # Try converting the first value to a float
        has_header = False     # If successful, there's no header
    except ValueError:
        has_header = True      # If it raises ValueError, there is a header
    
    # If there is a header, reload the CSV with the header
    if has_header:
        df = pd.read_csv(csv_file_path)
    
    # Check if we have 3 or 4 cones based on the number of columns
    if len(df.columns) == 4:
        df.columns = ['Wavelength', 'S-Response', 'M-Response', 'L-Response']
    elif len(df.columns) == 5:
        df.columns = ['Wavelength', 'S-Response', 'Q-Response', 'M-Response', 'L-Response']
    
    # Filter to keep only wavelengths between 390 and 700 nm
    df = df[(df['Wavelength'] >= 390) & (df['Wavelength'] <= 700)]

    # Check the step size
    wavelength_step = df['Wavelength'].iloc[1] - df['Wavelength'].iloc[0]
    
    if wavelength_step == 1:
        # Filter rows where the wavelength is a multiple of 10
        df = df[df['Wavelength'] % 10 == 0]

    # Extract the relevant columns as arrays
    wavelengths = df['Wavelength'].to_numpy()
    s_response = df['S-Response'].to_numpy()
    m_response = df['M-Response'].to_numpy()
    l_response = df['L-Response'].to_numpy()
    
    return wavelengths, s_response, m_response, l_response

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

import os
def generate_OCS(min_wavelength: int, max_wavelength: int, response_file_name: str):
    
    csv_file_path = os.path.join(os.getcwd(), "res/uploads/", response_file_name)
    wavelengths, s_response, m_response, l_response = read_cone_response(csv_file_path)
    

    if (wavelengths is None):
        # Cone responses of a typical trichromat.
        standard_trichromat = Observer.trichromat(np.arange(min_wavelength, max_wavelength + 1, 3))
        s_response = standard_trichromat.sensors[0].data
        m_response = standard_trichromat.sensors[1].data
        l_response = standard_trichromat.sensors[2].data
    else:
        print(f"Loaded response file: {response_file_name}")
        print(f"Wavelengths: {wavelengths}")
        print(f"Wavelengths: {len(wavelengths)}")
        print(f"S-Response: {len(s_response)}")
        print(f"M-Response: {len(m_response)}")
        print(f"L-Response: {len(l_response)}")

    # Assumes an indicator reflectance function where R = 1 at a single wavelength and 0 elsewhere,
    # and an illumination 1 everywhere.
    # This represents equations (9), (10), (11), (12), (13).
    points = np.vstack((s_response, 
                        m_response, 
                        l_response)).T
    points /= np.sum(m_response)

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
    
    # Normalize vertices to [0, 1] range
    min_coords = np.min(vertices, axis=0)
    max_coords = np.max(vertices, axis=0)
    range_coords = max_coords - min_coords
    normalized_vertices = (vertices - min_coords) / range_coords

    # Ensure the colors array has enough values to match the number of vertices
    if len(colors) < len(vertices):
        num_missing_colors = len(vertices) - len(colors)
        missing_colors = [[1.0, 1.0, 1.0]] * num_missing_colors  # Create a list of white [R, G, B] for missing colors
        colors.extend(missing_colors)  # Extend the colors list with the missing colors

    return normalized_vertices.tolist(), indices.tolist(), colors