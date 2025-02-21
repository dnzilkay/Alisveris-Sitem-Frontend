import React, { useEffect, useState } from "react";
import { Box, Typography, Toolbar, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/categoryService"; // Kategori servisinden import

interface Category {
    id: number;
    name: string;
}

const HomeNavbar: React.FC = () => {
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();
    const darkMode = false; // Temaya göre değiştirilebilir

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data); // Backend'den gelen kategoriler
            } catch (error) {
                console.error("Kategoriler alınırken hata oluştu:", error);
            }
        };

        getCategories();
    }, []);

    const handleCategoryMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setCategoryAnchorEl(event.currentTarget);
    };

    const handleCategoryMouseLeave = () => {
        setCategoryAnchorEl(null);
    };

    return (
        <Box
            sx={{
                position: "relative",
                backgroundColor: darkMode ? "#222" : "#f9f9f9",
                borderTop: "1px solid #ddd",
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    gap: 10,
                    paddingX: 1,
                }}
            >
                <Box
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                >
                    {/* Kategoriler */}
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: darkMode ? "#fff" : "#000",
                            "&:hover": { color: "#1976D2" },
                        }}
                    >
                        Kategoriler
                    </Typography>

                    {/* Açılır Menü */}
                    <Menu
                        anchorEl={categoryAnchorEl}
                        open={Boolean(categoryAnchorEl)}
                        onClose={handleCategoryMouseLeave}
                        sx={{
                            pointerEvents: "auto",
                            transform: "scale(0.95)",
                            transition: "transform 0.2s ease-in-out",
                            transformOrigin: "top center",
                        }}
                        PaperProps={{
                            sx: {
                                backgroundColor: darkMode ? "#444" : "#fff",
                                boxShadow: 3,
                                padding: 1,
                                minWidth: 200,
                            },
                        }}
                    >
                        {categories.map((category) => (
                            <MenuItem
                                key={category.id}
                                onClick={() => navigate(`/category/${category.id}`)} // ID ile yönlendirme
                                sx={{
                                    fontWeight: "bold",
                                    color: darkMode ? "#fff" : "#000",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, color: darkMode ? "#FFD700" : "#000" }}>
                                    <ChevronRight />
                                </ListItemIcon>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Diğer Sekmeler */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/new-products")}>
                        Yeni Ürünler
                    </Typography>
                    <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/discounts")}>
                        İndirimler
                    </Typography>
                    <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/best-sellers")}>
                        Çok Satanlar
                    </Typography>
                </Box>
            </Toolbar>
        </Box>
    );
};

export default HomeNavbar;
