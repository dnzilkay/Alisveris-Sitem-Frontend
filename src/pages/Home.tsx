import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { ArrowRight, CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import ProductCard from "../components/ProductCard";
import { CatalogProduct, catalogCategories } from "../data/catalog";
import { fetchProducts } from "../services/productService";

const serviceItems = [
    {
        icon: <Truck size={24} />,
        title: "Ücretsiz kargo",
        description: "1.500 TL ve üzeri siparişlerde",
    },
    {
        icon: <RotateCcw size={24} />,
        title: "Kolay iade",
        description: "14 gün içinde ücretsiz",
    },
    {
        icon: <ShieldCheck size={24} />,
        title: "Güvenli alışveriş",
        description: "Korunan ödeme adımları",
    },
    {
        icon: <CreditCard size={24} />,
        title: "Esnek ödeme",
        description: "Kart ve kapıda ödeme seçeneği",
    },
];

const Home: React.FC = () => {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setProducts(await fetchProducts());
            } catch (error) {
                console.error("Ürünler alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };
        void loadProducts();
    }, []);

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            <HomeNavbar />

            <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.08fr) minmax(360px, .92fr)" },
                        minHeight: { md: 480 },
                        bgcolor: "#172033",
                        color: "white",
                        borderRadius: { xs: 3, md: 4 },
                        overflow: "hidden",
                    }}
                >
                    <Stack justifyContent="center" alignItems="flex-start" sx={{ p: { xs: 3.5, sm: 5, md: 7 } }}>
                        <Chip
                            label="Yeni sezon seçkisi"
                            sx={{ bgcolor: "rgba(255,255,255,.12)", color: "white", fontWeight: 800 }}
                        />
                        <Typography
                            component="h1"
                            sx={{
                                mt: 2.5,
                                maxWidth: 650,
                                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.65rem" },
                                lineHeight: 1.04,
                                letterSpacing: "-0.055em",
                                fontWeight: 900,
                            }}
                        >
                            Günlük hayatın için iyi seçilmiş ürünler.
                        </Typography>
                        <Typography sx={{ mt: 2, maxWidth: 560, color: "rgba(255,255,255,.72)", fontSize: { md: "1.05rem" } }}>
                            Teknolojiden ev yaşamına, gerçekten kullanacağın parçaları tek bir mağazada keşfet.
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3.5, width: { xs: "100%", sm: "auto" } }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                endIcon={<ArrowRight size={18} />}
                                onClick={() => navigate("/new-products")}
                            >
                                Yeni gelenleri keşfet
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={() => navigate("/discounts")}
                                sx={{ borderColor: "rgba(255,255,255,.5)" }}
                            >
                                Fırsatlara bak
                            </Button>
                        </Stack>
                    </Stack>
                    <Box
                        role="img"
                        aria-label="Modern mağazada seçili ürünler"
                        sx={{
                            minHeight: { xs: 300, md: "100%" },
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=88&w=1400)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                </Box>
            </Container>

            <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "flex-end" }}
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="overline" color="secondary.main" fontWeight={900}>
                            Kolay keşif
                        </Typography>
                        <Typography component="h2" variant="h4" fontWeight={900} letterSpacing="-0.035em">
                            Kategorine göre alışveriş yap
                        </Typography>
                    </Box>
                    <Button endIcon={<ArrowRight size={17} />} onClick={() => navigate("/search")}>
                        Tüm ürünler
                    </Button>
                </Stack>
                <Grid container spacing={2}>
                    {catalogCategories.map((category) => (
                        <Grid item xs={12} sm={6} md={2.4} key={category.id}>
                            <Box
                                onClick={() => navigate(`/category/${category.id}`)}
                                sx={{
                                    position: "relative",
                                    minHeight: 230,
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    backgroundImage: `linear-gradient(180deg, transparent 25%, rgba(9,16,28,.82) 100%), url(${category.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    transition: "transform 180ms ease",
                                    "&:hover": { transform: "translateY(-3px)" },
                                }}
                            >
                                <Box sx={{ position: "absolute", inset: "auto 0 0", p: 2.25, color: "white" }}>
                                    <Typography variant="h6" fontWeight={900}>{category.name}</Typography>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,.75)" }}>
                                        Koleksiyonu gör
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box sx={{ bgcolor: "background.paper", borderY: "1px solid", borderColor: "divider" }}>
                <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ sm: "flex-end" }}
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ mb: 3 }}
                    >
                        <Box>
                            <Typography variant="overline" color="secondary.main" fontWeight={900}>
                                Bu hafta
                            </Typography>
                            <Typography component="h2" variant="h4" fontWeight={900} letterSpacing="-0.035em">
                                Öne çıkan ürünler
                            </Typography>
                        </Box>
                        <Button endIcon={<ArrowRight size={17} />} onClick={() => navigate("/best-sellers")}>
                            Hepsini gör
                        </Button>
                    </Stack>
                    <Grid container spacing={2.5}>
                        {loading
                            ? Array.from({ length: 4 }, (_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Skeleton variant="rounded" height={430} sx={{ borderRadius: 3 }} />
                                </Grid>
                            ))
                            : products.slice(0, 4).map((product) => (
                                <Grid item xs={12} sm={6} md={3} key={product.id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        bgcolor: "#f3e7da",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            minHeight: { xs: 300, md: 430 },
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=88&w=1200)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <Stack justifyContent="center" alignItems="flex-start" sx={{ p: { xs: 3.5, sm: 5, md: 7 }, color: "#1f2937" }}>
                        <Typography variant="overline" fontWeight={900} color="secondary.main">
                            Evde iyi hissettirenler
                        </Typography>
                        <Typography component="h2" variant="h3" fontWeight={900} letterSpacing="-0.045em" sx={{ mt: 1 }}>
                            Kahve molanı yeniden düzenle.
                        </Typography>
                        <Typography sx={{ mt: 2, maxWidth: 520, color: "#596273" }}>
                            Sade bir tezgâh, doğru ekipman ve her sabah aynı lezzet. Ev yaşamı seçkisindeki yeni ürünleri incele.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowRight size={18} />}
                            onClick={() => navigate("/category/2")}
                            sx={{ mt: 3 }}
                        >
                            Ev & Yaşam seçkisi
                        </Button>
                    </Stack>
                </Box>
            </Container>

            <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 9 } }}>
                <Grid container spacing={2}>
                    {serviceItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.title}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
                            >
                                <Box sx={{ color: "secondary.main" }}>{item.icon}</Box>
                                <Box>
                                    <Typography fontWeight={800}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
