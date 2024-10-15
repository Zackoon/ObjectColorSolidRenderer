import { ActionIcon, rgba } from '@mantine/core';
import { ChevronLeft, ChevronRight} from 'tabler-icons-react';

export type DropdownButtonProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    leftDropdown: boolean,
}

export default function DropdownButton({open, setOpen, leftDropDown} : DropdownButtonProps) {
    return (
        <ActionIcon
            size={30}
            radius="s"
            color="gray"
            variant="filled"
            style={{
                zIndex: 2,
                backgroundColor: rgba("239, 239, 240", 0.3),
            }}
            onClick={() => setOpen(!open)}
        >
            {
                leftDropDown 
                ? (open ? <ChevronLeft size={30} /> : <ChevronRight size={30} />)
                : (open ? <ChevronRight size={30} /> : <ChevronLeft size={30} />)
            }
        </ActionIcon>
    )
};