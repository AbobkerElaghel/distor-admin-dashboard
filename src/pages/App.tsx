import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useContext } from "react";
import RTLPluginProvider from "../providers/RTLPluginProvider";
import { RTLContext } from "../providers/RTLProvider";
import { ThemeContext } from "../providers/ThemeProvider";
import AppRouter from "../router/AppRouter";
import theme from "../themes/theme";

function App() {
  const RTL = useContext(RTLContext);
  const Theme = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme(RTL?.isRTL || false, Theme?.isDarkMode || false)}>
      <RTLPluginProvider>
        <AppRouter />
      </RTLPluginProvider>
    </ThemeProvider>
  );
}

export default App;
