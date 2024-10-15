import { AppShell, Container, Grid, useMantineTheme, Text, Title, Skeleton, Stack, MantineTheme } from "@mantine/core";
import ObjectColorSolid from "./ObjectColorSolid";
import SliceDisplay from "./SliceDisplay/SliceDisplay";
import GraphDisplay from "./GraphDisplay/GraphDisplay";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import React from 'react';


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

const OCSStyle: React.CSSProperties = {
  position: 'absolute',
  marginTop: '-5%',
  marginLeft: '-2.5%',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
}

const headerStyle = (theme: MantineTheme) => {
  return {
    backgroundColor: theme.colors.myColor[7],
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  }
}

type AppContextType = {
  height: number,
  sliceDimension: number,
  setSliceDimension: Dispatch<SetStateAction<number>>,
  conePeaks: {
    sConePeak: number,
    mConePeak: number,
    lConePeak: number,
  },
  setConePeaks: Dispatch<SetStateAction<{
    sConePeak: number,
    mConePeak: number,
    lConePeak: number,
  }>>,
  submitSwitch: number,
  setSubmitSwitch: Dispatch<SetStateAction<number>>,
  coneResponseType: string,
  setConeResponseType: Dispatch<SetStateAction<string>>,
  wavelengthBounds: {
    min: number,
    max: number,
  },
  setWavelengthBounds: Dispatch<SetStateAction<{
    min: number,
    max: number
  }>>,
}

// TODO: make the actual placeholder value rather than undefined since this may be messing with the form div in the bottom right
export const AppContext = createContext<AppContextType | undefined>(undefined)

export const DEFAULT_S_PEAK = 455;
export const DEFAULT_M_PEAK = 543;
export const DEFAULT_L_PEAK = 566;
const MIN_VISIBLE_WAVELENGTH = 390;
const MAX_VISIBLE_WAVELENGTH = 700; 

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [sliceDimension, setSliceDimension] = useState(2);
  const [conePeaks, setConePeaks] = useState({
    sConePeak: DEFAULT_S_PEAK,
    mConePeak: DEFAULT_M_PEAK, 
    lConePeak: DEFAULT_L_PEAK
  });
  const [coneResponseType, setConeResponseType] = useState('Human Trichromat')
  const [submitSwitch, setSubmitSwitch] = useState(1)  // Here just to indicate whether a submission occurred
  const { width: _width, height } = useWindowDimensions(); 
  const [wavelengthBounds, setWavelengthBounds] = useState({
    min: MIN_VISIBLE_WAVELENGTH,
    max: MAX_VISIBLE_WAVELENGTH
  });

  return (
    <AppContext.Provider value={{
      height,
      sliceDimension, setSliceDimension,
      conePeaks, setConePeaks,
      coneResponseType, setConeResponseType,
      submitSwitch, setSubmitSwitch,
      wavelengthBounds, setWavelengthBounds
      }}>
        {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType | undefined => {
  return useContext(AppContext);
};

export default function AppLayout() {
    const theme = useMantineTheme();

    return (
        <AppContextProvider>
          <AppShell
            header={{ height: 50 }}
            padding="sm"
          >
            {/* Header Section */}
            <AppShell.Header style={headerStyle(theme)}>
              <Title order={3} ml="lg"> Object Color Solid Renderer </Title>
            </AppShell.Header>
    
            {/* Main Content Section */}
            <AppShell.Main >
              <Container my="xl" fluid>
                {/* Absolute positioned OCS irrespective of the dropdown menus */}
                <div style={OCSStyle}>
                  <ObjectColorSolid/>
                </div>

                {/* Dropdown Menus/Buttons */}
                <Grid>
                  <Grid.Col span={1} style={{zIndex: 2}}>
                    <SliceDisplay/>
                  </Grid.Col>

                  <Grid.Col span={10} style={{ position: 'relative' }}>
                    {/* Just to space out the two sidebars */}
                  </Grid.Col>

                  <Grid.Col span={1} style={{zIndex: 2}}>
                    <GraphDisplay/>
                  </Grid.Col>
                </Grid>
              </Container>
            </AppShell.Main>
          </AppShell>
        </AppContextProvider>
    );
}
