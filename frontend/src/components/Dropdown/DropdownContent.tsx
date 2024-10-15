import { Paper, rgba, Collapse, Button } from "@mantine/core";
import React from "react";

type DropdownContentProps = {
    children: React.ReactNode,
    open: boolean,
}

const paperStyle = (open: boolean) => {
    return { 
        width: open ? 200 : 0, // Collapses the 
        borderRadius: 10, // Full circular shape
        zIndex: 999,
        transition: 'width 0.7s ease',
        backgroundColor: rgba("239, 239, 240", 0.2),
        padding: '5%',
    }
}

export default function DropdownContent({ children, open } : DropdownContentProps) {
    return <>
        <Paper
            shadow="xl"
            style={paperStyle(open)}
        >
            <Collapse in={open}>
                {children}
            </Collapse>
        </Paper>
        </>
}