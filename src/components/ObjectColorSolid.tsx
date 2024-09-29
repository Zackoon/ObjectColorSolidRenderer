import { Stack } from "@mantine/core";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface ObjectColorSolidProps {
  height: number;
}

export default function ObjectColorSolid({ height }: ObjectColorSolidProps) {
  return (
    <Stack>
      <div style={{ height: `${height}px` }}>
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <boxGeometry args={[3, 3, 3]} />
            <meshStandardMaterial color="royalblue" />
          </mesh>
          <OrbitControls />
        </Canvas>
      </div>
    </Stack>
  );
}