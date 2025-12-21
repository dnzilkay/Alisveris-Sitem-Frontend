import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Toolbar,
    Menu,
    MenuItem,
    ListItemIcon,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
} from "@mui/material";
import { ChevronRight, Menu as MenuIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { useThemeContext } from "../context/ThemeContext";

interface Category {
    id: number;
    name: string;
}

const HomeNavbar: React.FC = () => {
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { darkMode } = useThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error("Kategoriler alınırken hata oluştu:", error);
            }
        };

        getCategories();
    }, []);

    const handleCategoryMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        if (!isMobile) {
            setCategoryAnchorEl(event.currentTarget);
        }
    };

    const handleCategoryMouseLeave = () => {
        setCategoryAnchorEl(null);
    };

    const handleCategoryClick = (categoryId: number) => {
        navigate(`/category/${categoryId}`);
        setMobileDrawerOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileDrawerOpen(false);
    };

    return (
        <Box
            sx={{
                position: "relative",
                background: darkMode
                    ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                    : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                borderTop: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #dee2e6",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    gap: { xs: 1, md: 4 },
                    paddingX: { xs: 1, md: 3 },
                    minHeight: { xs: "48px", md: "64px" },
                    flexWrap: { xs: "wrap", md: "nowrap" },
                }}
            >
                {/* Kategoriler - Desktop */}
                {!isMobile && (
                    <Box
                        onMouseEnter={handleCategoryMouseEnter}
                        onMouseLeave={handleCategoryMouseLeave}
                        sx={{ position: "relative" }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                cursor: "pointer",
                                color: darkMode ? "#fff" : "#667eea",
                                fontSize: "1rem",
                                "&:hover": { color: darkMode ? "#a78bfa" : "#764ba2" },
                                transition: "color 0.3s",
                            }}
                        >
                            Kategoriler
                        </Typography>

                        <Menu
                            anchorEl={categoryAnchorEl}
                            open={Boolean(categoryAnchorEl)}
                            onClose={handleCategoryMouseLeave}
                            PaperProps={{
                                sx: {
                                    backgroundColor: darkMode ? "#1e293b" : "#fff",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                    padding: 1,
                                    minWidth: 220,
                                    borderRadius: 2,
                                    mt: 1,
                                },
                            }}
                        >
                            {categories.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    sx={{
                                        fontWeight: 500,
                                        color: darkMode ? "#f1f5f9" : "#1e293b",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: darkMode ? "rgba(139, 92, 246, 0.2)" : "rgba(102, 126, 234, 0.1)",
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 0, color: darkMode ? "#a78bfa" : "#667eea" }}>
                                        <ChevronRight size={18} />
                                    </ListItemIcon>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                )}

                {/* Mobil Menü Butonu */}
                {isMobile && (
                    <IconButton
                        onClick={() => setMobileDrawerOpen(true)}
                        sx={{
                            color: darkMode ? "#fff" : "#667eea",
                            ml: "auto",
                        }}
                    >
                        <MenuIcon size={24} />
                    </IconButton>
                )}

                {/* Diğer Sekmeler - Desktop */}
                {!isMobile && (
                    <Box sx={{ display: "flex", gap: { md: 3, lg: 4 }, flex: 1, justifyContent: "center" }}>
                        <Typography
                            sx={{
                                cursor: "pointer",
                                color: darkMode ? "#cbd5e1" : "#64748b",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                "&:hover": { color: darkMode ? "#a78bfa" : "#667eea" },
                                transition: "color 0.3s",
                            }}
                            onClick={() => navigate("/new-products")}
                        >
                            Yeni Ürünler
                        </Typography>
                        <Typography
                            sx={{
                                cursor: "pointer",
                                color: darkMode ? "#cbd5e1" : "#64748b",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                "&:hover": { color: darkMode ? "#a78bfa" : "#667eea" },
                                transition: "color 0.3s",
                            }}
                            onClick={() => navigate("/discounts")}
                        >
                            İndirimler
                        </Typography>
                        <Typography
                            sx={{
                                cursor: "pointer",
                                color: darkMode ? "#cbd5e1" : "#64748b",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                "&:hover": { color: darkMode ? "#a78bfa" : "#667eea" },
                                transition: "color 0.3s",
                            }}
                            onClick={() => navigate("/best-sellers")}
                        >
                            Çok Satanlar
                        </Typography>
                    </Box>
                )}
            </Toolbar>

            {/* Mobil Drawer */}
            <Drawer
                anchor="right"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: darkMode
                            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                            : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                        color: darkMode ? "#fff" : "#1e293b",
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ color: darkMode ? "#fff" : "#1e293b", fontWeight: 600 }}>
                            Menü
                        </Typography>
                        <IconButton onClick={() => setMobileDrawerOpen(false)}>
                            <X size={24} color={darkMode ? "#fff" : "#1e293b"} />
                        </IconButton>
                    </Box>

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => setMobileDrawerOpen(false)}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    backgroundColor: darkMode ? "rgba(139, 92, 246, 0.2)" : "rgba(102, 126, 234, 0.1)",
                                }}
                            >
                                <ListItemText
                                    primary="Kategoriler"
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: darkMode ? "#a78bfa" : "#667eea",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        {categories.map((category) => (
                            <ListItem key={category.id} disablePadding>
                                <ListItemButton
                                    onClick={() => handleCategoryClick(category.id)}
                                    sx={{
                                        pl: 4,
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: darkMode ? "rgba(139, 92, 246, 0.1)" : "rgba(102, 126, 234, 0.05)",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{
                                            color: darkMode ? "#cbd5e1" : "#64748b",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Box sx={{ my: 2, borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#dee2e6"}` }} />
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigation("/new-products")}>
                                <ListItemText
                                    primary="Yeni Ürünler"
                                    primaryTypographyProps={{
                                        color: darkMode ? "#cbd5e1" : "#64748b",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigation("/discounts")}>
                                <ListItemText
                                    primary="İndirimler"
                                    primaryTypographyProps={{
                                        color: darkMode ? "#cbd5e1" : "#64748b",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigation("/best-sellers")}>
                                <ListItemText
                                    primary="Çok Satanlar"
                                    primaryTypographyProps={{
                                        color: darkMode ? "#cbd5e1" : "#64748b",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default HomeNavbar;
