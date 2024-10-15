import { Stack, Skeleton, Flex } from "@mantine/core";
import Slice from "./Slice";
import SliceSelector from "./SliceSelector";
import SpectraGraph from "../GraphDisplay/SpectraGraph";
import SpectraInputs from "../GraphDisplay/SpectraInputs";
import { useAppContext } from "../AppLayout";


export default function SliceDisplay() {
    const { height } = useAppContext()
    return (
        <Flex
            align="flex-start" 
            direction="column" 
            justify="space-between" 
            style={{ height: height/1.25, maxHeight: height }}
            gap = 'md'
        >
            <SliceSelector></SliceSelector>
            <Slice></Slice>
        </Flex>
    )
}