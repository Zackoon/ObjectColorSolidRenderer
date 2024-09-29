import { Skeleton, Stack } from "@mantine/core";

interface ObjectColorSolidProps  {
    height: number
}

export default function ObjectColorSolid({ height }: ObjectColorSolidProps) {
    return (
        <Stack>
            <Skeleton height={height}>
                
            </Skeleton>
        </Stack>
        
    )
}