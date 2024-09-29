import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppLayout></AppLayout>
    </MantineProvider>
  );
}
