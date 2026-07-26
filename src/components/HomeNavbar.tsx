import React, { useEffect, useState } from "react";
import { Box, Button, Container, Menu, MenuItem, Stack } from "@mui/material";
import { ChevronDown, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoryWithProducts, fetchCategories } from "../services/categoryService";

const HomeNavbar: React.FC = () => {
    const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategories(await fetchCategories());
            } catch (error) {
                console.error("Kategoriler alınamadı:", error);
            }
        };
        void loadCategories();
    }, []);

    return (
        <Box
            component="nav"
            aria-label="Mağaza menüsü"
            sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}
        >
            <Container maxWidth="xl">
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{ xs: 0.5, md: 1 }}
                    sx={{ minHeight: 50, overflowX: "auto", scrollbarWidth: "none" }}
                >
                    <Button
                        color="inherit"
                        endIcon={<ChevronDown size={16} />}
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                        sx={{ whiteSpace: "nowrap", fontWeight: 800 }}
                    >
                        Tüm kategoriler
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        slotProps={{ paper: { sx: { mt: 1, minWidth: 240, p: 0.75 } } }}
                    >
                        {categories.map((category) => (
                            <MenuItem
                                key={category.id}
                                onClick={() => {
                                    navigate(`/category/${category.id}`);
                                    setAnchorEl(null);
                                }}
                                sx={{ borderRadius: 1.5, py: 1.25 }}
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Button color="inherit" onClick={() => navigate("/new-products")} sx={{ whiteSpace: "nowrap" }}>
                        Yeni gelenler
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/best-sellers")} sx={{ whiteSpace: "nowrap" }}>
                        Çok satanlar
                    </Button>
                    <Button
                        color="secondary"
                        startIcon={<Percent size={16} />}
                        onClick={() => navigate("/discounts")}
                        sx={{ ml: { md: "auto !important" }, whiteSpace: "nowrap", fontWeight: 800 }}
                    >
                        Fırsatlar
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default HomeNavbar;
