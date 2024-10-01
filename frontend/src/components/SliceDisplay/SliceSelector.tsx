import { Stack, Skeleton, Popover, Button, ActionIcon, Center, Collapse, Paper, rgba } from "@mantine/core";
import { useState } from "react";
import { ChevronUp, ChevronDown } from 'tabler-icons-react';

interface GraphDisplayProps {
    height: number
}

export default function GraphDisplay({ height }: GraphDisplayProps) {
    const [opened, setOpened] = useState(false);

    return (
        // <Skeleton height={height}>
        <div>
            {/* Floating Toggle Button */}
            <ActionIcon
                size={30}
                radius="xl"
                color="gray"
                variant="filled"
                style={{
                    zIndex: 9999,
                    backgroundColor: rgba("239, 239, 240", 0.3),
                }}
                onClick={() => setOpened((open) => !open)}
            >
                {opened ? <ChevronDown size={30} /> : <ChevronUp size={30} />}
            </ActionIcon>

            {/* Circular Floating Control Panel */}
            <Paper
                shadow="xl"
                // padding="md"
                style={{
                    width: opened ? 200 : 0, // Change width based on state
                    height: 60, // Fixed height for the circle effect
                    borderRadius: 30, // Full circular shape
                    zIndex: 9999,
                    transition: 'width 0.3s ease',
                    backgroundColor: rgba("239, 239, 240", 0.2),
                }}
            >
                <Collapse in={opened}>
                <Center style={{ height: 60 }}> {/* Center content vertically */}
                    <Button
                    // compact
                    variant="white"
                    onClick={() => alert('Action 1')}
                    style={{ marginRight: 5 }}
                    >
                    A1
                    </Button>
                    <Button
                    // compact
                    variant="white"
                    onClick={() => alert('Action 2')}
                    style={{ marginRight: 5 }}
                    >
                    A2
                    </Button>
                    <Button
                    // compact
                    variant="white"
                    onClick={() => alert('Action 3')}
                    >
                    A3
                    </Button>
                </Center>
                </Collapse>
            </Paper>
        </div>
        // </Skeleton>
    )
}