import { Paper, rgba, Collapse, Button } from "@mantine/core";
import React from "react";

type DropdownContentProps = {
    children: React.ReactNode,
    open: boolean,
    width?: number,
}

const paperStyle = (open: boolean, width: number) => {
    return { 
        width: open ? width : 0, // Collapses the 
        borderRadius: 10, // Full circular shape
        zIndex: 999,
        transition: 'width 0.7s ease',
        backgroundColor: rgba("239, 239, 240", 0.2),
        padding: '5%',
    }
}

export default function DropdownContent({ children, open, width=200 } : DropdownContentProps) {
    return <>
        <Paper
            shadow="xl"
            style={paperStyle(open, width)}
        >
            <Collapse in={open}>
                {children}
            </Collapse>
        </Paper>
        </>
}