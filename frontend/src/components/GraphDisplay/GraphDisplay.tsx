import { Stack, Skeleton, Flex } from "@mantine/core";
import SpectraGraph from "./SpectraGraph";
import SpectraInputs from "./SpectraInputs";

interface GraphDisplayProps {
    height: number
}

export default function GraphDisplay({ height }: GraphDisplayProps) {
    return (
        <Flex
            align="flex-start" 
            direction="column" 
            justify="space-between" 
            style={{ height: '100%', maxHeight: height }}
            gap = 'md'
        >
            <SpectraGraph height={height/2}></SpectraGraph>
            <SpectraInputs height={height/2}></SpectraInputs>
        </Flex>
    )
}