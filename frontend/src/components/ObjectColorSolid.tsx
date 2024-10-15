import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAppContext } from './AppLayout';
import { Button, FileInput } from '@mantine/core';

const CustomShaderMaterial = shaderMaterial(
  { col: new THREE.Color(0xff00ff) },
  '',
  ''
);

extend({ CustomShaderMaterial });

function CustomMesh({ geometry, vertexShader, fragmentShader }) {
  const meshRef = useRef();
  const { clock } = useThree();

  const material = new CustomShaderMaterial();
  material.vertexShader = vertexShader;
  material.fragmentShader = fragmentShader;

  useFrame(() => {
    if (meshRef.current) {
      material.uniforms.col.value.setHSL(clock.getElapsedTime() % 1, 1, 0.5);
    }
  });

  return <mesh ref={meshRef} scale={0.5} geometry={geometry} material={material} />;
}

type OcsData = {
  geometry: THREE.BufferGeometry,
  vertexShader: String,
  fragmentShader: String,
}

export default function ObjectColorSolid() {
  const [ocsData, setOcsData] = useState<OcsData>({geometry: new THREE.BufferGeometry(), vertexShader: '', fragmentShader: ''});
  const { conePeaks, submitSwitch, wavelengthBounds, responseFileName, wavelengths, setWavelengths, coneResponses, setConeResponses } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams({
      minWavelength: wavelengthBounds.min.toString(),
      maxWavelength: wavelengthBounds.max.toString(),
      responseFileName: responseFileName,
    });
    console.log(params.toString())

    fetch(`http://localhost:5000/get_ocs_data?${params.toString()}`)
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
        geometry.translate(-0.5, -0.5, -0.5);

        setOcsData({
          geometry,
          vertexShader: data.vertexShader,
          fragmentShader: data.fragmentShader
        });

        setWavelengths(data.wavelengths.flat())
        setConeResponses({
          sConeResponse: data.s_response.flat(),
          mConeResponse: data.m_response.flat(),
          lConeResponse: data.l_response.flat(),
        })
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [submitSwitch]);


  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0.43, 0.3, 0.4], fov: 60 }}>
        {ocsData && (
          <CustomMesh 
            // key={submitSwitch}
            geometry={ocsData.geometry}
            vertexShader={ocsData.vertexShader}
            fragmentShader={ocsData.fragmentShader}
          />
        )}
        <OrbitControls target={[0, 0, 0]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}