import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import ProductCard from "../components/ProductCard";
import { CatalogCategory, CatalogProduct } from "../data/catalog";
import { fetchCategoryById } from "../services/categoryService";
import { fetchProducts } from "../services/productService";

const CategoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<CatalogCategory | null>(null);
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategory = async () => {
            try {
                setError("");
                const categoryId = Number(id);
                const [categoryData, allProducts] = await Promise.all([
                    fetchCategoryById(categoryId),
                    fetchProducts(),
                ]);
                setCategory(categoryData);
                setProducts(allProducts.filter((product) => product.categoryId === categoryId));
            } catch (loadError) {
                console.error("Kategori yüklenemedi:", loadError);
                setError("Bu kategori bulunamadı.");
            }
        };
        void loadCategory();
    }, [id]);

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={900}>{error}</Typography>
                <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate("/")} sx={{ mt: 2 }}>
                    Mağazaya dön
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "70vh", bgcolor: "background.default" }}>
            <HomeNavbar />
            {category && (
                <Box
                    sx={{
                        position: "relative",
                        minHeight: { xs: 280, md: 360 },
                        display: "flex",
                        alignItems: "flex-end",
                        color: "white",
                        backgroundImage: `linear-gradient(90deg, rgba(10,18,30,.88), rgba(10,18,30,.25)), url(${category.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
                        <Typography variant="overline" fontWeight={900} sx={{ color: "secondary.light" }}>
                            NOVA seçkisi
                        </Typography>
                        <Typography component="h1" variant="h2" fontWeight={900} letterSpacing="-0.05em">
                            {category.name}
                        </Typography>
                        <Typography sx={{ mt: 1, maxWidth: 590, color: "rgba(255,255,255,.78)" }}>
                            {category.description}
                        </Typography>
                    </Container>
                </Box>
            )}

            <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} letterSpacing="-0.035em">
                            Seçili ürünler
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {products.length} ürün listeleniyor
                        </Typography>
                    </Box>
                </Stack>
                <Grid container spacing={2.5}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default CategoryPage;
