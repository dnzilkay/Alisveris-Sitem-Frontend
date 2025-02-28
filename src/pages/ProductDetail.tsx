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
        <Box sx={{ padding: 4 }}>
            {/* Ürün Detayları */}
            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <CardMedia
                    component="img"
                    image={
                        item.images && item.images.length > 0
                            ? Array.isArray(item.images) && typeof item.images[0] === "string"
                                ? item.images[0] // Eğer `images[0]` bir `string` ise, direkt kullan
                                : item.images[0].url // Eğer `images[0]` bir `object` ise, `.url` özelliğini kullan
                            : "https://via.placeholder.com/200" // Varsayılan resim
                    }
                    alt={item.name}
                    sx={{ width: "300px", borderRadius: 2 }}
                />
                <Box>
                    <Typography variant="h4">{item.name}</Typography>
                    <Typography paragraph>Stok: {item.stock}</Typography>
                    <Typography paragraph>{item.description}</Typography>
                    <Typography variant="h5" color="primary">{item.price} TL</Typography>
                    <Typography sx={{ marginTop: 1 }}>
                        Ortalama Puan: <Rating value={averageRating} readOnly /> ({averageRating.toFixed(1)})
                    </Typography>
                    <Typography>Satın Alınma Sayısı: {getStoredSalesCount()}</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                            addToCart({
                                id: item.id,
                                name: item.name,
                                image: item.images[0]?.url || "https://via.placeholder.com/200", // İlk resmi kullan veya varsayılan
                                price: item.price,
                                quantity: 1,
                            })
                        }
                        sx={{ marginTop: 2 }}
                    >
                        Sepete Ekle
                    </Button>
                </Box>
            </Box>

            <Divider />

            {/* Sekmeler */}
            <Box sx={{ marginTop: 4 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab label="Ürün Bilgileri" />
                    <Tab label="Açıklamalar" />
                    <Tab label="Yorumlar" />
                </Tabs>

                <Box sx={{ padding: 3 }}>
                    {tabIndex === 0 && <Typography>Bu ürün yüksek performanslı bir donanıma sahiptir.</Typography>}
                    {tabIndex === 1 && <Typography>Detaylı açıklamalar burada yer alır.</Typography>}
                    {tabIndex === 2 && (
                        <Box sx={{ marginTop: 4 }}>
                            <Typography variant="h6" gutterBottom>Yorumlar ve Değerlendirmeler</Typography>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Yorumunuzu Yazın"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button variant="contained" onClick={handleAddReview}>
                                Yorum Ekle
                            </Button>

                            {/* Yorum Listesi */}
                            <Box sx={{ marginTop: 3 }}>
                                {reviews.length > 0 ? (
                                    reviews.map((item, index) => (
                                        <Card key={index} sx={{ marginBottom: 2, padding: 2, display: "flex", alignItems: "flex-start", gap: 2 }}>
                                            <Avatar>{`K${index + 1}`}</Avatar>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                    Kullanıcı {index + 1}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <Rating value={item.rating} readOnly size="small" />
                                                    {new Date().toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body1" sx={{ marginTop: 1 }}>
                                                    {item.text}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography>Henüz yorum yapılmamış.</Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            <Divider sx={{ marginY: 4 }} />

            {/* Benzer Ürünler */}
            <Box>
                <Typography variant="h5" gutterBottom>Benzer Ürünler</Typography>
                <Grid container spacing={3}>
                    {similarProducts.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card sx={{ maxWidth: 250, margin: "auto", boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={
                                        item.images && item.images.length > 0
                                            ? Array.isArray(item.images) && typeof item.images[0] === "string"
                                                ? item.images[0] // Eğer `images[0]` bir `string` ise, direkt kullan
                                                : item.images[0].url // Eğer `images[0]` bir `object` ise, `.url` özelliğini kullan
                                            : "https://via.placeholder.com/200" // Varsayılan resim
                                    }
                                    alt={item.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" noWrap>{item.name}</Typography>
                                    <Typography>{item.price} TL</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        sx={{ marginTop: 1 }}
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
