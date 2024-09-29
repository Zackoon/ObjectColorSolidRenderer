import { Skeleton, Stack } from "@mantine/core";
import { Canvas } from "@react-three/fiber";

interface ObjectColorSolidProps  {
    height: number
}

export default function ObjectColorSolid({ height }: ObjectColorSolidProps) {
    return (
        <Stack>
            {/* <Canvas>
               <mesh>
                    <boxGeometry args={[5, 5, 5]}/>
                    <meshStandardMaterial />
                </mesh> 
            </Canvas> */}
            
            <Skeleton height={height}>

            </Skeleton>
        </Stack>

    )
}