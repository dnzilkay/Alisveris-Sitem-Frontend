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
} from "@mui/material";
import { ShoppingCart, Search,  ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";  //AuthContext'i ekledik




const Navbar: React.FC = () => {
    const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null);
    const { toggleTheme, darkMode } = useThemeContext();
    const navigate = useNavigate();
    const { cart } = useCart();
    const { user, logout } = useAuth(); // AuthContext'ten user ve logout fonksiyonu alındı






    // Avatar Menü Kontrolleri
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAvatarAnchorEl(event.currentTarget);
    };

    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);



    return (
        <Box>
            {/* Üst Navbar */}
            <AppBar position="static" sx={{ backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Logo */}
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ cursor: "pointer", color: "indigo" }}
                        onClick={() => navigate("/")}
                    >
                        Alışveriş Sitesi
                    </Typography>

                    {/* Arama Çubuğu */}
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <Box sx={{ position: "relative", width: "50%" }}>
                            <InputBase
                                placeholder="Ürün Ara..."
                                sx={{
                                    width: "100%",
                                    border: "1px solid gray",
                                    borderRadius: 4,
                                    px: 2,
                                    py: 1,
                                }}
                            />
                            <Search style={{ position: "absolute", right: 10, top: 10, color: "gray" }} />
                        </Box>
                    </Box>

                    {/* Sağ Kısım */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Tema Değiştirme */}
                        <DarkModeSwitch
                            checked={darkMode}
                            onChange={toggleTheme}
                            size={30}
                            moonColor="#FFD700"
                            sunColor="#FFA500"
                        />
                        <IconButton onClick={() => navigate("/cart")}>
                            <Badge badgeContent={totalItems} color="error">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>

                        {/* Kullanıcı Menüsü */}
                        {user ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconButton onClick={handleAvatarClick}>
                                    <Avatar>{user?.username?.charAt(0).toUpperCase()}</Avatar>
                                    <ChevronDown />
                                </IconButton>
                                <Menu anchorEl={avatarAnchorEl} open={Boolean(avatarAnchorEl)} onClose={handleAvatarClose}>
                                    <MenuItem onClick={() => navigate("/profile")}>Profil</MenuItem>
                                    <MenuItem onClick={() => navigate("/orders")}>Siparişlerim</MenuItem>
                                    {user.role === "admin" && (
                                        <MenuItem onClick={() => navigate("/admin")}>Admin Paneli</MenuItem>
                                    )}
                                    <MenuItem
                                        onClick={() => {
                                            logout();
                                            handleAvatarClose();
                                            navigate("/auth"); // Çıkış sonrası yönlendirme
                                        }}
                                    >
                                        Çıkış Yap
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Button variant="contained" color="secondary" onClick={() => navigate("/auth")}>
                                Giriş Yap / Kayıt Ol
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
