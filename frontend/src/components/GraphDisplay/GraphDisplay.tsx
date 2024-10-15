import { Stack, Skeleton, Flex } from "@mantine/core";
import SpectraGraph from "./SpectraGraph";
import SpectraInputs from "./SpectraInputs";
import { sub } from "three/webgpu";
import { useAppContext } from "../AppLayout";




export default function GraphDisplay(){
    const { height } = useAppContext()
    return (
        <Flex
            align="flex-end" 
            direction="column" 
            justify="space-between" 
            style={{ height: height/1.25, maxHeight: height }}
            gap = 'md'
        >
            <SpectraGraph></SpectraGraph>
            <SpectraInputs></SpectraInputs>
        </Flex>
    )
}