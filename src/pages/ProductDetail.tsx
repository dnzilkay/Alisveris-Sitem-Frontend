import React, { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Rating,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { Check, Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { CatalogProduct, getProductImage } from "../data/catalog";
import { fetchProductById, fetchProducts } from "../services/productService";
import { useFavorites } from "../context/favoritesContext";

interface LocalReview {
    text: string;
    rating: number;
}

const formatPrice = (price: number) =>
    price.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { favorites, toggleFavorite } = useFavorites();
    const [product, setProduct] = useState<CatalogProduct | null>(null);
    const [similarProducts, setSimilarProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tabIndex, setTabIndex] = useState(0);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState<number | null>(5);
    const [localReviews, setLocalReviews] = useState<LocalReview[]>([]);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const productId = Number(id);
                const [selectedProduct, allProducts] = await Promise.all([
                    fetchProductById(productId),
                    fetchProducts(),
                ]);
                setProduct(selectedProduct);
                setSimilarProducts(
                    allProducts
                        .filter((candidate) =>
                            candidate.categoryId === selectedProduct.categoryId &&
                            candidate.id !== selectedProduct.id,
                        )
                        .slice(0, 4),
                );
                const storedReviews = localStorage.getItem(`product-${productId}-reviews`);
                setLocalReviews(storedReviews ? JSON.parse(storedReviews) as LocalReview[] : []);
            } catch (loadError) {
                console.error("Ürün yüklenemedi:", loadError);
                setError("Bu ürün bulunamadı veya artık satışta değil.");
            } finally {
                setLoading(false);
            }
        };
        void loadProduct();
    }, [id]);

    const addReview = () => {
        if (!product || !review.trim() || rating === null) return;
        const nextReviews = [...localReviews, { text: review.trim(), rating }];
        setLocalReviews(nextReviews);
        localStorage.setItem(`product-${product.id}-reviews`, JSON.stringify(nextReviews));
        setReview("");
        setRating(5);
    };

    if (loading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
                <CircularProgress color="secondary" />
            </Stack>
        );
    }

    if (error || !product) {
        return (
            <Container maxWidth="md" sx={{ py: 10 }}>
                <Alert severity="warning">{error || "Ürün bulunamadı."}</Alert>
                <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>Mağazaya dön</Button>
            </Container>
        );
    }

    const productImage = getProductImage(product);
    const isFavorite = favorites.includes(product.id);
    const discountRate = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <Box sx={{ bgcolor: "background.default" }}>
            <HomeNavbar />
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2.5, cursor: "pointer" }}
                    onClick={() => navigate(`/category/${product.categoryId}`)}
                >
                    Ana sayfa / {product.category} / {product.name}
                </Typography>

                <Grid container spacing={{ xs: 4, md: 7 }}>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src={productImage}
                            alt={product.name}
                            sx={{
                                display: "block",
                                width: "100%",
                                aspectRatio: "1 / 1",
                                objectFit: "cover",
                                bgcolor: "grey.50",
                                borderRadius: 4,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack alignItems="flex-start">
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                                {product.badge && <Chip label={product.badge} color="secondary" size="small" />}
                                {product.isNew && <Chip label="Yeni" variant="outlined" size="small" />}
                            </Stack>
                            <Typography variant="overline" color="text.secondary" fontWeight={800}>
                                {product.category}
                            </Typography>
                            <Typography component="h1" variant="h3" fontWeight={900} letterSpacing="-0.045em">
                                {product.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                                <Rating value={product.rating} precision={0.1} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">
                                    {product.rating} · {product.reviewCount + localReviews.length} değerlendirme
                                </Typography>
                            </Stack>
                            <Typography sx={{ mt: 2.5, color: "text.secondary", lineHeight: 1.75 }}>
                                {product.description}
                            </Typography>

                            <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mt: 3 }}>
                                <Typography variant="h4" fontWeight={900}>{formatPrice(product.price)}</Typography>
                                {product.oldPrice && (
                                    <>
                                        <Typography color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                            {formatPrice(product.oldPrice)}
                                        </Typography>
                                        <Chip label={`%${discountRate} indirim`} color="error" size="small" />
                                    </>
                                )}
                            </Stack>
                            <Typography variant="body2" color="success.main" fontWeight={800} sx={{ mt: 1 }}>
                                Stokta · 1–2 iş gününde kargoda
                            </Typography>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 3, width: "100%" }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<ShoppingBag size={20} />}
                                    onClick={() =>
                                        addToCart({
                                            id: product.id,
                                            name: product.name,
                                            image: productImage,
                                            price: product.price,
                                            quantity: 1,
                                        })
                                    }
                                    sx={{ flex: 1, py: 1.4 }}
                                >
                                    Sepete ekle
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    color={isFavorite ? "error" : "primary"}
                                    startIcon={<Heart size={20} fill={isFavorite ? "currentColor" : "none"} />}
                                    onClick={() => toggleFavorite(product.id)}
                                    sx={{ py: 1.4 }}
                                >
                                    {isFavorite ? "Favorilerden çıkar" : "Favoriye ekle"}
                                </Button>
                            </Stack>

                            <Grid container spacing={1.5} sx={{ mt: 2 }}>
                                {[
                                    [<Truck size={20} />, "1.500 TL üzeri ücretsiz kargo"],
                                    [<RotateCcw size={20} />, "14 gün içinde kolay iade"],
                                    [<ShieldCheck size={20} />, "Güvenli ödeme adımları"],
                                ].map(([icon, label]) => (
                                    <Grid item xs={12} sm={4} key={String(label)}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2, height: "100%" }}
                                        >
                                            <Box sx={{ color: "secondary.main" }}>{icon}</Box>
                                            <Typography variant="caption" fontWeight={700}>{label}</Typography>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{ mt: { xs: 6, md: 9 }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_event, value: number) => setTabIndex(value)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ px: { xs: 1, md: 3 }, borderBottom: "1px solid", borderColor: "divider" }}
                    >
                        <Tab label="Ürün özellikleri" />
                        <Tab label="Teslimat ve iade" />
                        <Tab label={`Değerlendirmeler (${product.reviewCount + localReviews.length})`} />
                    </Tabs>
                    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                        {tabIndex === 0 && (
                            <Grid container spacing={2}>
                                {product.features.map((feature) => (
                                    <Grid item xs={12} sm={6} key={feature}>
                                        <Stack direction="row" spacing={1.25} alignItems="center">
                                            <Check size={19} color="#ea580c" />
                                            <Typography>{feature}</Typography>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {tabIndex === 1 && (
                            <Typography color="text.secondary" sx={{ maxWidth: 800, lineHeight: 1.8 }}>
                                Siparişler demo akışında 1–2 iş günü içinde kargoya hazırlanır. Kullanılmamış ürünler
                                teslimden sonraki 14 gün içinde iade edilebilir. Bu ekran bir e-ticaret arayüzü
                                demonstrasyonudur; gerçek ödeme veya kargo işlemi yapılmaz.
                            </Typography>
                        )}
                        {tabIndex === 2 && (
                            <Stack spacing={2.5}>
                                {localReviews.map((item, index) => (
                                    <Box key={`${item.text}-${index}`} sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                                        <Rating value={item.rating} readOnly size="small" />
                                        <Typography sx={{ mt: 0.75 }}>{item.text}</Typography>
                                    </Box>
                                ))}
                                <Divider />
                                <Typography variant="h6" fontWeight={800}>Deneyimini paylaş</Typography>
                                <Rating value={rating} onChange={(_event, value) => setRating(value)} />
                                <TextField
                                    value={review}
                                    onChange={(event) => setReview(event.target.value)}
                                    label="Ürün hakkındaki görüşün"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                                <Button variant="contained" onClick={addReview} sx={{ alignSelf: "flex-start" }}>
                                    Değerlendirme ekle
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Box>

                {similarProducts.length > 0 && (
                    <Box sx={{ mt: { xs: 6, md: 9 } }}>
                        <Typography component="h2" variant="h4" fontWeight={900} letterSpacing="-0.035em" sx={{ mb: 3 }}>
                            Bunlar da ilgini çekebilir
                        </Typography>
                        <Grid container spacing={2.5}>
                            {similarProducts.map((similarProduct) => (
                                <Grid item xs={12} sm={6} md={3} key={similarProduct.id}>
                                    <ProductCard product={similarProduct} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ProductDetail;
