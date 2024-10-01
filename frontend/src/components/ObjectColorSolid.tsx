import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader, extend, useThree } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 light = vec3(0.5, 0.2, 1.0);
    light = normalize(light);
    float dProd = max(0.0, dot(vNormal, light));
    gl_FragColor = vec4(color * dProd, 1.0);
  }
`;

const CustomShaderMaterial = shaderMaterial(
  { color: new THREE.Color(0xff00ff) },
  vertexShader,
  fragmentShader
);

extend({ CustomShaderMaterial });

function CustomMesh() {
  const objRef = useRef();
  const obj = useLoader(OBJLoader, '../../../res/teapot.obj');
  const { clock } = useThree();

  const material = useMemo(() => {
    return new CustomShaderMaterial();
  }, []);

  useFrame(() => {
    if (objRef.current) {
      objRef.current.rotation.y += 10;
      material.uniforms.color.value.setHSL(clock.getElapsedTime() % 1, 1, 0.5);
    }
  });

  // Clone the geometry to ensure it's not shared
  const geometry = useMemo(() => obj.children[0].geometry.clone(), [obj]);

  return (
    <mesh ref={objRef} scale={0.5} geometry={geometry} material={material} />
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <React.Suspense fallback={null}>
          <CustomMesh />
        </React.Suspense>
        <OrbitControls />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}
