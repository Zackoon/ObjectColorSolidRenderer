import { Stack, Skeleton, ActionIcon, Button, Collapse, Paper, rgba } from "@mantine/core";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

interface GraphDisplayProps {
    height: number
}

const boxStyle = {
    margin: 10,
    padding: 5,
};

export default function GraphDisplay({ height }: GraphDisplayProps) {
    const [opened, setOpened] = useState(false);
    
    return (
        <div>
            <ActionIcon
                size={30}
                radius="s"
                color="gray"
                variant="filled"
                style={{
                    zIndex: 9999,
                    backgroundColor: rgba("239, 239, 240", 0.3),
                }}
                onClick={() => setOpened((open) => !open)}
            >
                {opened ? <ChevronLeft size={30} /> : <ChevronRight size={30} />}
            </ActionIcon>

            {/* Circular Floating Control Panel */}
            <Paper
                shadow="xl"
                style={{
                    width: opened ? 200 : 0, // Collapses the 
                    borderRadius: 10, // Full circular shape
                    zIndex: 9999,
                    transition: 'width 0.3s ease',
                    backgroundColor: rgba("239, 239, 240", 0.2),
                }}
            >
                <Collapse in={opened}>
                    <Stack gap="m">
                        <Button
                            variant="white"
                            onClick={() => alert('Action 1')}
                            style={boxStyle}
                        >
                            1D
                        </Button>
                        <Button
                            variant="white"
                            onClick={() => alert('Action 2')}
                            style={boxStyle}
                        >
                            2D
                        </Button>
                        <Button
                            variant="white"
                            onClick={() => alert('Action 3')}
                            style={boxStyle}
                        >
                            3D
                        </Button>
                    </Stack>
                </Collapse>
            </Paper>
        </div>
    )
}