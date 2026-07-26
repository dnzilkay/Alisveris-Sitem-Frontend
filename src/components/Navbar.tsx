import React, { FormEvent, useState } from "react";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    InputBase,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Heart, Menu as MenuIcon, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useThemeContext } from "../context/ThemeContext";
import { useFavorites } from "../context/favoritesContext";

const Navbar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [avatarAnchorEl, setAvatarAnchorEl] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { darkMode, toggleTheme } = useThemeContext();
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        const query = searchTerm.trim();
        navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
        setMobileMenuOpen(false);
    };

    const navigateAndClose = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
        setAvatarAnchorEl(null);
    };

    return (
        <Box component="header">
            <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 0.75 }}>
                <Container maxWidth="xl">
                    <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={{ xs: 1, sm: 3 }}
                        divider={<Box component="span" sx={{ opacity: 0.45 }}>•</Box>}
                    >
                        <Typography variant="caption" fontWeight={700}>
                            1.500 TL üzeri ücretsiz kargo
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ display: { xs: "none", sm: "block" } }}>
                            14 gün kolay iade
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ display: { xs: "none", md: "block" } }}>
                            Güvenli ödeme
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            <AppBar
                position="sticky"
                color="inherit"
                elevation={0}
                sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 78 }, gap: { xs: 1, md: 3 } }}>
                        {isMobile && (
                            <IconButton
                                aria-label="Menüyü aç"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <MenuIcon size={22} />
                            </IconButton>
                        )}

                        <Box
                            onClick={() => navigate("/")}
                            sx={{ cursor: "pointer", display: "flex", alignItems: "baseline", minWidth: "fit-content" }}
                        >
                            <Typography
                                component="span"
                                sx={{ fontSize: { xs: "1.45rem", md: "1.75rem" }, fontWeight: 900, letterSpacing: "-0.06em" }}
                            >
                                NOVA
                            </Typography>
                            <Box component="span" sx={{ width: 7, height: 7, ml: 0.4, borderRadius: "50%", bgcolor: "secondary.main" }} />
                        </Box>

                        <Box
                            component="form"
                            onSubmit={submitSearch}
                            sx={{
                                flex: 1,
                                maxWidth: 720,
                                mx: "auto",
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                                bgcolor: "action.hover",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                px: 1.75,
                            }}
                        >
                            <Search size={20} color={theme.palette.text.secondary} />
                            <InputBase
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Ürün, kategori veya koleksiyon ara"
                                inputProps={{ "aria-label": "Ürün ara" }}
                                sx={{ flex: 1, ml: 1.25, py: 1 }}
                            />
                            <Button type="submit" size="small" sx={{ px: 2 }}>
                                Ara
                            </Button>
                        </Box>

                        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 0.5 }}>
                            <Tooltip title={darkMode ? "Açık tema" : "Koyu tema"}>
                                <IconButton aria-label="Temayı değiştir" onClick={toggleTheme}>
                                    {darkMode ? <Sun size={21} /> : <Moon size={21} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Favoriler">
                                <IconButton
                                    aria-label="Favoriler"
                                    onClick={() => navigate("/favorites")}
                                    sx={{ display: { xs: "none", sm: "inline-flex" } }}
                                >
                                    <Badge badgeContent={favorites.length} color="secondary">
                                        <Heart size={21} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Sepetim">
                                <IconButton aria-label="Sepetim" onClick={() => navigate("/cart")}>
                                    <Badge badgeContent={totalItems} color="secondary">
                                        <ShoppingBag size={22} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            {user ? (
                                <>
                                    <IconButton
                                        aria-label="Hesap menüsü"
                                        onClick={(event) => setAvatarAnchorEl(event.currentTarget)}
                                    >
                                        <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 14 }}>
                                            {user.username?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                    <Menu
                                        anchorEl={avatarAnchorEl}
                                        open={Boolean(avatarAnchorEl)}
                                        onClose={() => setAvatarAnchorEl(null)}
                                    >
                                        <MenuItem onClick={() => navigateAndClose("/profile")}>Hesabım</MenuItem>
                                        <MenuItem onClick={() => navigateAndClose("/orders")}>Siparişlerim</MenuItem>
                                        {user.role === "admin" && (
                                            <MenuItem onClick={() => navigateAndClose("/admin")}>Yönetim paneli</MenuItem>
                                        )}
                                        <MenuItem
                                            sx={{ color: "error.main" }}
                                            onClick={() => {
                                                logout();
                                                navigateAndClose("/");
                                            }}
                                        >
                                            Çıkış yap
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Button
                                    onClick={() => navigate("/auth")}
                                    startIcon={<UserRound size={18} />}
                                    color="inherit"
                                    sx={{ display: { xs: "none", sm: "inline-flex" }, whiteSpace: "nowrap" }}
                                >
                                    Giriş yap
                                </Button>
                            )}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                PaperProps={{ sx: { width: "min(88vw, 340px)", p: 2.5 } }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={900}>NOVA.</Typography>
                    <IconButton aria-label="Menüyü kapat" onClick={() => setMobileMenuOpen(false)}>
                        <X size={22} />
                    </IconButton>
                </Stack>
                <Box
                    component="form"
                    onSubmit={submitSearch}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        px: 1.5,
                        mb: 2,
                    }}
                >
                    <Search size={19} />
                    <InputBase
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Ürün ara"
                        sx={{ ml: 1, flex: 1, py: 0.75 }}
                    />
                </Box>
                <List disablePadding>
                    {[
                        ["Ana sayfa", "/"],
                        ["Yeni gelenler", "/new-products"],
                        ["Fırsatlar", "/discounts"],
                        ["Çok satanlar", "/best-sellers"],
                        ["Favoriler", "/favorites"],
                        [user ? "Hesabım" : "Giriş yap", user ? "/profile" : "/auth"],
                    ].map(([label, path]) => (
                        <ListItemButton key={path} onClick={() => navigateAndClose(path)}>
                            <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 700 }} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};

export default Navbar;
