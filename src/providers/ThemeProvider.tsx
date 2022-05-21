import React, { createContext, useState } from 'react';
import { useEffect } from 'react';

interface ThemeProviderContextType {
    isDarkMode: boolean
    toggleDarkMode: () => void
};

export const ThemeContext = createContext<ThemeProviderContextType | null>({ isDarkMode: false, toggleDarkMode: () => { } });
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');

        if (theme === 'dark') {
            toggleDarkMode("dark")
            setDarkMode(true);
        } else if (theme === 'light') {
            toggleDarkMode("light")
            setDarkMode(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleDarkMode = (mode?: "dark" | "light") => {
        if (mode === 'dark') {
            localStorage.setItem("theme", 'dark');
            document.body.style.background = "#070733";
            document.documentElement.classList.add('dark');
            return;
        } else if (mode === 'light') {
            localStorage.setItem("theme", 'light');
            document.body.style.background = "#F5F5F5";
            document.documentElement.classList.remove('dark');
            return;
        }

        if (isDarkMode) {
            localStorage.setItem("theme", 'light');
            document.body.style.background = "#F5F5F5";
            document.documentElement.classList.remove('dark');
        } else {
            localStorage.setItem("theme", 'dark');
            document.body.style.background = "#070733";
            document.documentElement.classList.add('dark');
        }
        setDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
};

export default ThemeProvider;