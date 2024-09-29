import { Stack, Skeleton, Flex } from "@mantine/core";
import Slice from "./Slice";
import SliceSelector from "./SliceSelector";
import SpectraGraph from "../GraphDisplay/SpectraGraph";
import SpectraInputs from "../GraphDisplay/SpectraInputs";

interface SliceDisplayProps  {
    height: number
}

export default function SliceDisplay({ height }: SliceDisplayProps) {
    return (
        <Flex
            align="flex-start" 
            direction="column" 
            justify="space-between" 
            style={{ height: '100%' }}
        >
            <SliceSelector height={height/2.5}></SliceSelector>
            <Slice height={height/1.8}></Slice>
        </Flex>
    )
}