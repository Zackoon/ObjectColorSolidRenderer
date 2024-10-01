import { Stack, Skeleton } from "@mantine/core";

interface GraphDisplayProps {
    height: number
}

export default function GraphDisplay({ height }: GraphDisplayProps) {
    return (
        <Skeleton height={height}>

        </Skeleton>
    )
}