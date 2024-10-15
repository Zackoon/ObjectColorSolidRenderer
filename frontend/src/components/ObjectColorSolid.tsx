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
  const { conePeaks, submitSwitch, setSubmitSwitch, wavelengthBounds, responseFileName } = useAppContext();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      minWavelength: wavelengthBounds.min.toString(),
      maxWavelength: wavelengthBounds.max.toString(),
      responseFileName: responseFileName,
    });

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
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [submitSwitch, wavelengthBounds, responseFileName]);

  const handleFileUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload_file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);
      // Trigger a re-render or update of the OCS here if needed
      setSubmitSwitch(prev => prev + 1);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <FileInput
          placeholder="Choose file"
          onChange={setFile}
          accept=".txt,.csv"
          style={{ marginBottom: '10px' }}
        />
        <Button onClick={handleFileUpload} disabled={!file}>
          Upload File
        </Button>
      </div>
      <Canvas camera={{ position: [0.43, 0.3, 0.4], fov: 60 }}>
        {ocsData && (
          <CustomMesh 
            key={submitSwitch}
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