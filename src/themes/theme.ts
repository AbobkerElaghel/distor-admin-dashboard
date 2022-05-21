import createTheme from '@mui/material/styles/createTheme';
const mainDarkModeColor = "#070733";
const secondaryDarkModeColor = "#161C51";

const mainLightModeColor = "#F5F5F5";
const secondaryLightModeColor = "#FFFFFF";
const theme = (isRTL: boolean, isDarkMode: boolean) => (createTheme({
    direction: isRTL ? "rtl" : "ltr",
    palette: {
        mode: isDarkMode ? "dark" : "light",
        primary: {
            main: isDarkMode ? "#7266EC" : "#AB1515",
        },
        secondary: {
            main: isDarkMode ? secondaryDarkModeColor : secondaryLightModeColor
        },
        background: {
            default: isDarkMode ? mainDarkModeColor : mainLightModeColor,
            paper: isDarkMode ? secondaryDarkModeColor : secondaryLightModeColor
        },
    }
}
))

export default theme;

