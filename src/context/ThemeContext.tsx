import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
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
                        main: darkMode ? "#8b5cf6" : "#667eea",
                        light: darkMode ? "#a78bfa" : "#818cf8",
                        dark: darkMode ? "#7c3aed" : "#5568d3",
                        contrastText: "#ffffff",
                    },
                    secondary: {
                        main: darkMode ? "#ec4899" : "#f06292",
                        light: darkMode ? "#f472b6" : "#ff94c2",
                        dark: darkMode ? "#db2777" : "#c2185b",
                    },
                    background: {
                        default: darkMode ? "#0f172a" : "#f8f9fa",
                        paper: darkMode ? "#1e293b" : "#ffffff",
                    },
                    text: {
                        primary: darkMode ? "#f1f5f9" : "#1e293b",
                        secondary: darkMode ? "#94a3b8" : "#64748b",
                    },
                    success: {
                        main: "#10b981",
                        light: "#34d399",
                        dark: "#059669",
                    },
                    error: {
                        main: "#ef4444",
                        light: "#f87171",
                        dark: "#dc2626",
                    },
                    warning: {
                        main: "#f59e0b",
                        light: "#fbbf24",
                        dark: "#d97706",
                    },
                    info: {
                        main: "#3b82f6",
                        light: "#60a5fa",
                        dark: "#2563eb",
                    },
                },
                typography: {
                    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
                    h1: {
                        fontWeight: 700,
                        fontSize: "2.5rem",
                        "@media (max-width:768px)": {
                            fontSize: "2rem",
                        },
                    },
                    h2: {
                        fontWeight: 700,
                        fontSize: "2rem",
                        "@media (max-width:768px)": {
                            fontSize: "1.75rem",
                        },
                    },
                    h3: {
                        fontWeight: 600,
                        fontSize: "1.75rem",
                        "@media (max-width:768px)": {
                            fontSize: "1.5rem",
                        },
                    },
                    h4: {
                        fontWeight: 600,
                        fontSize: "1.5rem",
                        "@media (max-width:768px)": {
                            fontSize: "1.25rem",
                        },
                    },
                    h5: {
                        fontWeight: 600,
                        fontSize: "1.25rem",
                        "@media (max-width:768px)": {
                            fontSize: "1.1rem",
                        },
                    },
                    h6: {
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        "@media (max-width:768px)": {
                            fontSize: "1rem",
                        },
                    },
                },
                shape: {
                    borderRadius: 12,
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                textTransform: "none",
                                fontWeight: 600,
                                padding: "10px 24px",
                                borderRadius: "8px",
                                boxShadow: "none",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                                },
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: "16px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                                    transform: "translateY(-4px)",
                                },
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                },
                            },
                        },
                    },
                },
            }),
        [darkMode]
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
