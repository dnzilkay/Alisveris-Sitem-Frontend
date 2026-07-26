import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

interface ThemeContextType {
    toggleTheme: () => void;
    darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => setDarkMode((prev) => !prev);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    primary: {
                        main: darkMode ? "#f8fafc" : "#172033",
                        contrastText: darkMode ? "#172033" : "#ffffff",
                    },
                    secondary: {
                        main: "#ea580c",
                        light: "#fb923c",
                        dark: "#c2410c",
                        contrastText: "#ffffff",
                    },
                    background: {
                        default: darkMode ? "#111827" : "#f7f7f5",
                        paper: darkMode ? "#182132" : "#ffffff",
                    },
                    text: {
                        primary: darkMode ? "#f8fafc" : "#172033",
                        secondary: darkMode ? "#aeb8c7" : "#667085",
                    },
                    divider: darkMode ? "rgba(255,255,255,.11)" : "#e7e8e6",
                },
                typography: {
                    fontFamily:
                        '"Avenir Next", Avenir, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                    button: {
                        fontWeight: 800,
                        textTransform: "none",
                    },
                },
                shape: {
                    borderRadius: 12,
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                                boxShadow: "none",
                                paddingInline: 18,
                            },
                        },
                    },
                    MuiChip: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                backgroundImage: "none",
                            },
                        },
                    },
                },
            }),
        [darkMode],
    );

    return (
        <ThemeContext.Provider value={{ toggleTheme, darkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeContext must be used within a ThemeContextProvider");
    return context;
};
