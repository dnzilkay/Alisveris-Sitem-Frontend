import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    CardMedia,
    Divider,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    TextField,
    Rating,
    Avatar,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { fetchProductById, fetchProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    images: { id: number; url: string; productId: number }[];
    category: string;
}

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState<{ userId: string; text: string; rating: number }[]>([]);
    const [rating, setRating] = useState<number | null>(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState<string | null>(null); // Hata durumu

    // LocalStorage'dan Satın Alım Sayısı ve Yorumları Al
    const getStoredSalesCount = () => {
        const salesCount = localStorage.getItem(`product-${id}-sales`);
        return salesCount ? parseInt(salesCount) : 0; // Varsayılan değer: 0
    };

    const getStoredReviews = () => {
        const storedReviews = localStorage.getItem(`product-${id}-reviews`);
        return storedReviews ? JSON.parse(storedReviews) : []; // Varsayılan boş dizi
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null); // Önceki hatayı temizle
                // Ürün bilgilerini al
                const productData = await fetchProductById(Number(id));
                setItem(productData);

                // Benzer ürünleri getir
                const allProducts = await fetchProducts();
                const relatedProducts = allProducts.filter(
                    (p: Product) => p.category === productData.category && p.id !== productData.id
                );
                setSimilarProducts(relatedProducts);

                // Yorumları localStorage'dan al
                const storedReviews = getStoredReviews();
                setReviews(storedReviews);
            } catch (error) {
                console.error("Ürün bilgisi alınırken hata oluştu:", error);
                setError("Ürün bilgileri alınırken bir hata oluştu.");
            } finally {
                setLoading(false); // Yükleme işlemi bitti
            }
        };

        fetchProductData();
    }, [id]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleAddReview = () => {
        if (review.trim() && rating !== null) {
            const userId = `${new Date().getTime()}`; // Yorum yapan kişinin id'si
            const newReview = { userId, text: review, rating };

            // Yorumları güncelle ve localStorage'a kaydet
            const updatedReviews = [...reviews, newReview];
            setReviews(updatedReviews);
            localStorage.setItem(`product-${id}-reviews`, JSON.stringify(updatedReviews));

            // Yorum alanını sıfırla
            setReview("");
            setRating(null);
        }
    };

    const averageRating = reviews.length
        ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        : 0;

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Box>
        );
    }

    if (!item) {
        return <Typography variant="h5" align="center">Ürün Bulunamadı</Typography>;
    }

    return (
        <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
            {/* Ürün Detayları */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 2, md: 4 },
                    marginBottom: 4,
                }}
            >
                <CardMedia
                    component="img"
                    image={
                        item.images && item.images.length > 0
                            ? Array.isArray(item.images) && typeof item.images[0] === "string"
                                ? item.images[0]
                                : item.images[0].url
                            : "https://via.placeholder.com/200"
                    }
                    alt={item.name}
                    sx={{
                        width: { xs: "100%", md: "400px" },
                        maxWidth: { xs: "100%", md: "400px" },
                        borderRadius: 3,
                        objectFit: "cover",
                        boxShadow: 4,
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        {item.name}
                    </Typography>
                    <Typography paragraph sx={{ color: "text.secondary", mb: 1 }}>
                        Stok: {item.stock} adet
                    </Typography>
                    <Typography
                        paragraph
                        sx={{
                            color: "text.secondary",
                            mb: 2,
                            fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                    >
                        {item.description}
                    </Typography>
                    <Typography
                        variant="h5"
                        color="primary"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                        }}
                    >
                        {item.price.toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                        })}
                    </Typography>
                    <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Typography sx={{ mr: 1 }}>Ortalama Puan:</Typography>
                        <Rating value={averageRating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                            ({averageRating.toFixed(1)})
                        </Typography>
                    </Box>
                    <Typography sx={{ mb: 2, color: "text.secondary" }}>
                        Satın Alınma Sayısı: {getStoredSalesCount()}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth={false}
                        onClick={() =>
                            addToCart({
                                id: item.id,
                                name: item.name,
                                image: item.images[0]?.url || "https://via.placeholder.com/200",
                                price: item.price,
                                quantity: 1,
                            })
                        }
                        sx={{
                            marginTop: 2,
                            px: 4,
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    >
                        Sepete Ekle
                    </Button>
                </Box>
            </Box>

            <Divider />

            {/* Sekmeler */}
            <Box sx={{ marginTop: 4 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        mb: 3,
                    }}
                >
                    <Tab label="Ürün Bilgileri" />
                    <Tab label="Açıklamalar" />
                    <Tab label="Yorumlar" />
                </Tabs>

                <Box sx={{ padding: { xs: 2, md: 3 } }}>
                    {tabIndex === 0 && (
                        <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                            Bu ürün yüksek performanslı bir donanıma sahiptir. Modern teknoloji ile üretilmiş olup,
                            uzun ömürlü kullanım için tasarlanmıştır.
                        </Typography>
                    )}
                    {tabIndex === 1 && (
                        <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                            Detaylı açıklamalar burada yer alır. Ürünün teknik özellikleri, kullanım alanları ve
                            avantajları hakkında kapsamlı bilgiler.
                        </Typography>
                    )}
                    {tabIndex === 2 && (
                        <Box sx={{ marginTop: { xs: 2, md: 4 } }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                Yorumlar ve Değerlendirmeler
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: "background.paper",
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 3,
                                    boxShadow: 2,
                                }}
                            >
                                <Rating
                                    name="rating"
                                    value={rating}
                                    onChange={(_, newValue) => setRating(newValue)}
                                    sx={{ marginBottom: 2 }}
                                    size="large"
                                />
                                <TextField
                                    label="Yorumunuzu Yazın"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddReview}
                                    disabled={!review.trim() || rating === null}
                                    sx={{ px: 3 }}
                                >
                                    Yorum Ekle
                                </Button>
                            </Box>

                            {/* Yorum Listesi */}
                            <Box sx={{ marginTop: 3 }}>
                                {reviews.length > 0 ? (
                                    reviews.map((item, index) => (
                                        <Card
                                            key={index}
                                            sx={{
                                                marginBottom: 2,
                                                padding: 2,
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 2,
                                                borderRadius: 2,
                                                boxShadow: 2,
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: "primary.main" }}>{`K${index + 1}`}</Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    Kullanıcı {index + 1}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                    <Rating value={item.rating} readOnly size="small" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date().toLocaleDateString("tr-TR")}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ color: "text.primary" }}>
                                                    {item.text}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>
                                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            <Divider sx={{ marginY: 4 }} />

            {/* Benzer Ürünler */}
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                >
                    Benzer Ürünler
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                    {similarProducts.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card
                                sx={{
                                    maxWidth: { xs: "100%", sm: 300 },
                                    margin: "auto",
                                    boxShadow: 3,
                                    borderRadius: 3,
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        boxShadow: 8,
                                        transform: "translateY(-4px)",
                                    },
                                }}
                                onClick={() => navigate(`/product/${item.id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height: { xs: 180, sm: 200 },
                                        objectFit: "cover",
                                    }}
                                    image={
                                        item.images && item.images.length > 0
                                            ? Array.isArray(item.images) && typeof item.images[0] === "string"
                                                ? item.images[0]
                                                : item.images[0].url
                                            : "https://via.placeholder.com/200"
                                    }
                                    alt={item.name}
                                />
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 600,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ fontWeight: 700, mb: 2 }}
                                    >
                                        {item.price.toLocaleString("tr-TR", {
                                            style: "currency",
                                            currency: "TRY",
                                        })}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        fullWidth
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Detay
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default ProductDetail;
