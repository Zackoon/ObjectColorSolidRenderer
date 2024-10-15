import { Stack, Button} from "@mantine/core";
import { useState } from "react";
import DropdownContent from "../Dropdown/DropdownContent";
import DropdownButton from "../Dropdown/DropdownButton";


const boxStyle = {
    margin: 10,
    padding: 5,
};

export default function GraphDisplay() {
    const [open, setOpen] = useState(false);
    
    return (
        <div>
            <DropdownButton open={open} setOpen={setOpen} leftDropdown={false}></DropdownButton>
            <DropdownContent open={open}>
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
            </DropdownContent>
        </div>
    )
}