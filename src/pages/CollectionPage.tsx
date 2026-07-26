import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import ProductCard from "../components/ProductCard";
import { CatalogProduct } from "../data/catalog";
import { fetchProducts } from "../services/productService";
import { useFavorites } from "../context/favoritesContext";

export type CollectionMode = "all" | "new" | "discounts" | "best-sellers" | "favorites";

interface CollectionPageProps {
    mode?: CollectionMode;
}

const collectionCopy: Record<CollectionMode, { eyebrow: string; title: string; description: string }> = {
    all: {
        eyebrow: "Mağaza",
        title: "Tüm ürünler",
        description: "Teknoloji, ev, giyim ve aksesuar seçkisinin tamamını keşfet.",
    },
    new: {
        eyebrow: "Yeni sezon",
        title: "Yeni gelenler",
        description: "Kataloğa yeni eklenen ve günlük hayatı kolaylaştıran ürünler.",
    },
    discounts: {
        eyebrow: "Sınırlı süre",
        title: "Güncel fırsatlar",
        description: "Seçili ürünlerde avantajlı fiyatları kaçırmadan incele.",
    },
    "best-sellers": {
        eyebrow: "En sevilenler",
        title: "Çok satanlar",
        description: "Müşterilerin en sık tercih ettiği ürünleri bir arada gör.",
    },
    favorites: {
        eyebrow: "Kişisel seçki",
        title: "Favorilerim",
        description: "Beğendiğin ürünleri burada bir araya getirebilirsin.",
    },
};

const CollectionPage: React.FC<CollectionPageProps> = ({ mode = "all" }) => {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { favorites } = useFavorites();
    const query = searchParams.get("q")?.trim().toLocaleLowerCase("tr-TR") ?? "";
    const copy = collectionCopy[mode];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setProducts(await fetchProducts());
            } catch (error) {
                console.error("Ürünler alınamadı:", error);
            }
        };
        void loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products;
        if (mode === "favorites") result = result.filter((product) => favorites.includes(product.id));
        if (mode === "new") result = result.filter((product) => product.isNew);
        if (mode === "discounts") result = result.filter((product) => product.oldPrice);
        if (mode === "best-sellers") result = [...result].sort((a, b) => b.sold - a.sold).slice(0, 6);
        if (query) {
            result = result.filter((product) =>
                `${product.name} ${product.category} ${product.shortDescription}`
                    .toLocaleLowerCase("tr-TR")
                    .includes(query),
            );
        }
        return result;
    }, [favorites, mode, products, query]);

    const pageTitle = query ? `"${searchParams.get("q")}" için sonuçlar` : copy.title;

    return (
        <Box sx={{ minHeight: "70vh", bgcolor: "background.default" }}>
            <HomeNavbar />
            <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
                <Typography variant="overline" color="secondary.main" fontWeight={900}>
                    {copy.eyebrow}
                </Typography>
                <Typography component="h1" variant="h3" fontWeight={900} letterSpacing="-0.04em">
                    {pageTitle}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
                    {copy.description}
                </Typography>

                {filteredProducts.length > 0 ? (
                    <Grid container spacing={2.5} sx={{ mt: 2 }}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            mt: 5,
                            minHeight: 280,
                            p: 4,
                            textAlign: "center",
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" fontWeight={800}>
                            {mode === "favorites" ? "Henüz favori ürünün yok" : "Aramana uygun ürün bulunamadı"}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {mode === "favorites"
                                ? "Ürün kartlarındaki kalp simgesini kullanarak bir seçki oluşturabilirsin."
                                : "Farklı bir ürün veya kategori adıyla tekrar deneyebilirsin."}
                        </Typography>
                        <Button
                            startIcon={<ArrowLeft size={18} />}
                            onClick={() => navigate("/")}
                            sx={{ mt: 2.5 }}
                        >
                            Mağazaya dön
                        </Button>
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default CollectionPage;
