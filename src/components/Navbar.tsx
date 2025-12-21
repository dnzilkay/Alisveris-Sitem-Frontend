import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    IconButton,
    Badge,
    Box,
    Menu,
    MenuItem,
    Button,
    Avatar,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { ShoppingCart, Search, ChevronDown, Menu as MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleTheme, darkMode } = useThemeContext();
    const navigate = useNavigate();
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAvatarAnchorEl(event.currentTarget);
    };

    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        handleMobileMenuClose();
    };

    return (
        <Box>
            <AppBar
                position="static"
                sx={{
                    background: darkMode
                        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: { xs: 1, md: 2 },
                        padding: { xs: "8px 12px", md: "12px 24px" },
                    }}
                >
                    {/* Logo */}
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        fontWeight="bold"
                        sx={{
                            cursor: "pointer",
                            color: "#fff",
                            flexShrink: 0,
                            background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                        onClick={() => navigate("/")}
                    >
                        {isMobile ? "A.S." : "Alışveriş Sitesi"}
                    </Typography>

                    {/* Arama Çubuğu - Desktop */}
                    {!isMobile && (
                        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", maxWidth: "500px", mx: 2 }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderRadius: "25px",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <InputBase
                                    placeholder="Ürün Ara..."
                                    sx={{
                                        width: "100%",
                                        color: "#fff",
                                        px: 2,
                                        py: 1,
                                        "&::placeholder": {
                                            color: "rgba(255,255,255,0.7)",
                                        },
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        right: 4,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#fff",
                                    }}
                                >
                                    <Search size={20} />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* Sağ Kısım */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 2 } }}>
                        {/* Mobil Menü Butonu */}
                        {isMobile && (
                            <IconButton
                                onClick={() => setMobileMenuOpen(true)}
                                sx={{ color: "#fff", mr: 1 }}
                            >
                                <MenuIcon size={24} />
                            </IconButton>
                        )}

                        {/* Tema Değiştirme */}
                        <DarkModeSwitch
                            checked={darkMode}
                            onChange={toggleTheme}
                            size={isMobile ? 24 : 30}
                            moonColor="#FFD700"
                            sunColor="#FFA500"
                        />

                        {/* Sepet */}
                        <IconButton
                            onClick={() => navigate("/cart")}
                            sx={{
                                color: "#fff",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                            }}
                        >
                            <Badge badgeContent={totalItems} color="error">
                                <ShoppingCart size={isMobile ? 20 : 24} />
                            </Badge>
                        </IconButton>

                        {/* Kullanıcı Menüsü - Desktop */}
                        {!isMobile && (
                            <>
                                {user ? (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <IconButton
                                            onClick={handleAvatarClick}
                                            sx={{
                                                color: "#fff",
                                                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                            }}
                                        >
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.2)" }}>
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <ChevronDown size={16} style={{ marginLeft: 4 }} />
                                        </IconButton>
                                        <Menu
                                            anchorEl={avatarAnchorEl}
                                            open={Boolean(avatarAnchorEl)}
                                            onClose={handleAvatarClose}
                                            PaperProps={{
                                                sx: {
                                                    borderRadius: 2,
                                                    mt: 1,
                                                    minWidth: 180,
                                                },
                                            }}
                                        >
                                            <MenuItem onClick={() => handleNavigation("/profile")}>Profil</MenuItem>
                                            <MenuItem onClick={() => handleNavigation("/orders")}>Siparişlerim</MenuItem>
                                            {user.role === "admin" && (
                                                <MenuItem onClick={() => handleNavigation("/admin")}>
                                                    Admin Paneli
                                                </MenuItem>
                                            )}
                                            <MenuItem
                                                onClick={() => {
                                                    logout();
                                                    handleAvatarClose();
                                                    navigate("/auth");
                                                }}
                                            >
                                                Çıkış Yap
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            color: "#fff",
                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                                        }}
                                        onClick={() => navigate("/auth")}
                                    >
                                        Giriş
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobil Menü Drawer */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: darkMode
                            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
                        Menü
                    </Typography>
                    {isMobile && (
                        <Box sx={{ mb: 2, p: 2, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                            <InputBase
                                placeholder="Ürün Ara..."
                                sx={{
                                    width: "100%",
                                    color: "#fff",
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                }}
                            />
                        </Box>
                    )}
                    <List>
                        {user ? (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleNavigation("/profile")}>
                                        <ListItemText primary="Profil" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleNavigation("/orders")}>
                                        <ListItemText primary="Siparişlerim" />
                                    </ListItemButton>
                                </ListItem>
                                {user.role === "admin" && (
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={() => handleNavigation("/admin")}>
                                            <ListItemText primary="Admin Paneli" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            logout();
                                            handleMobileMenuClose();
                                            navigate("/auth");
                                        }}
                                    >
                                        <ListItemText primary="Çıkış Yap" />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : (
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleNavigation("/auth")}>
                                    <ListItemText primary="Giriş Yap / Kayıt Ol" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Navbar;
