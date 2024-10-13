import { AppShell, Container, Grid, useMantineTheme, Text, Title, Skeleton, Stack } from "@mantine/core";
import ObjectColorSolid from "./ObjectColorSolid";
import SliceDisplay from "./SliceDisplay/SliceDisplay";
import GraphDisplay from "./GraphDisplay/GraphDisplay";
import { useEffect, useState } from "react";

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height
    }
}

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    return windowDimensions
}

export default function AppLayout() {
    const { width: _width, height }  = useWindowDimensions();
    const theme = useMantineTheme();
    // console.log(
    //     fetch('/ocs/helloworld')
    //     .then((response) => response.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => console.error('Error:', error))
    // );

    // const params = new URLSearchParams({
    //     start: '10',
    //     end: '20',
    //   });
      
    // console.log(
    //     fetch(`/ocs/range?${params.toString()}`)
    //     .then((response) => response.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => console.error('Error:', error))
    // );
    
    return (
        <>
          <AppShell
            header={{ height: 50 }}
            padding="sm"
          >
            {/* Header Section */}
            <AppShell.Header
              style={{
                backgroundColor: theme.colors.myColor[7],
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Title order={3} ml="lg"> Object Color Solid Renderer </Title>
            </AppShell.Header>
    
            {/* Main Content Section */}
            <AppShell.Main >
              <Container my="xl" fluid>
                <Grid>
                  {/* Left Sidebar */}
                  <Grid.Col span={3}>
                    <SliceDisplay height={height} />
                  </Grid.Col>
    
                  {/* Centered ObjectColorSolid Component with Absolute Positioning */}
                  <Grid.Col span={6} style={{ position: 'relative' }}>
                    {/* Absolute Positioned Wrapper */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ObjectColorSolid />
                    </div>
                  </Grid.Col>
    
                  {/* Right Sidebar */}
                  <Grid.Col span={3}>
                    <GraphDisplay height={height} />
                  </Grid.Col>
                </Grid>
              </Container>
            </AppShell.Main>
          </AppShell>
        </>
    );
}
