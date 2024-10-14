import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CustomShaderMaterial = shaderMaterial(
  { col: new THREE.Color(0xff00ff) }, // Default color
  '', // Placeholder for dynamic vertex shader
  ''  // Placeholder for dynamic fragment shader
);

extend({ CustomShaderMaterial });

function CustomMesh({ geometry, vertexShader, fragmentShader }) {
  const meshRef = useRef();
  const { clock } = useThree();

  // Create custom material and apply the shaders
  const material = new CustomShaderMaterial();
  material.vertexShader = vertexShader;
  material.fragmentShader = fragmentShader;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      // Animate color over time
      material.uniforms.col.value.setHSL(clock.getElapsedTime() % 1, 1, 0.5);
    }
  });

  return <mesh ref={meshRef} scale={0.5} geometry={geometry} material={material} />;
}

export default function ObjectColorSolid() {
  const [teapotData, setTeapotData] = useState(null);

  useEffect(() => {
    // Fetch 3D model data from Flask backend
    fetch('http://localhost:5000/get_ocs_data') // change to get_teapot_data for teapot
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then(data => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.vertices.flat(), 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals.flat(), 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colors.flat(), 3));
        geometry.setIndex(data.indices.flat());

        setTeapotData({
          geometry,
          vertexShader: data.vertexShader,
          fragmentShader: data.fragmentShader
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{ width: '100vh', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {teapotData && (
          <CustomMesh 
            geometry={teapotData.geometry}
            vertexShader={teapotData.vertexShader}
            fragmentShader={teapotData.fragmentShader}
          />
        )}
        <OrbitControls />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}
