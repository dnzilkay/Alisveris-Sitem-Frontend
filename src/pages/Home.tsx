import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeNavbar from "../components/HomeNavbar";
import { fetchProducts } from "../services/productService";

// Carousel Görselleri
const slides = [
    {
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070",
        title: "Yeni Koleksiyon",
        description: "Son gelen ürünlerimizi keşfedin",
    },
    {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070",
        title: "Yaz İndirimi",
        description: "Seçili ürünlerde %50'ye varan indirimler",
    },
    {
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070",
        title: "Özel Fırsatlar",
        description: "En iyi fiyatlarla şimdi alışveriş yapın",
    },
];

const Home: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [favorites, setFavorites] = useState<number[]>([]);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Backend'den ürünleri çek
    useEffect(() => {
        const fetchProductsFromBackend = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
                setVisibleProducts(data.slice(0, 3)); // İlk 3 ürünü göster
            } catch (error) {
                console.error("Ürünler alınırken hata:", error);
            }
        };

        fetchProductsFromBackend();
    }, []);

    // Sonsuz kaydırma
    const loadMoreProducts = () => {
        if (visibleProducts.length >= products.length) {
            setHasMore(false);
            return;
        }
        setVisibleProducts((prev) => [
            ...prev,
            ...products.slice(prev.length, prev.length + 3), // 3 ürün daha ekle
        ]);
    };

    // Carousel otomatik kaydırma
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const toggleFavorite = (id: number) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(id)
                ? prevFavorites.filter((favId) => favId !== id)
                : [...prevFavorites, id]
        );
    };

    return (
        <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
            {/* Alt Navbar */}
            <HomeNavbar />

            {/* Carousel */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "250px", sm: "300px", md: "400px" },
                    overflow: "hidden",
                }}
            >
                {slides.map((slide, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "absolute",
                            inset: 0,
                            transform: `translateX(${100 * (index - currentSlide)}%)`,
                            transition: "transform 0.5s ease-in-out",
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                                textAlign: "center",
                                px: { xs: 2, md: 4 },
                            }}
                        >
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                mb={2}
                                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
                            >
                                {slide.title}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}
                            >
                                {slide.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <IconButton
                    onClick={prevSlide}
                    sx={{
                        position: "absolute",
                        left: { xs: 8, md: 16 },
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                    }}
                >
                    <ChevronLeft size={isMobile ? 24 : 32} />
                </IconButton>
                <IconButton
                    onClick={nextSlide}
                    sx={{
                        position: "absolute",
                        right: { xs: 8, md: 16 },
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                    }}
                >
                    <ChevronRight size={isMobile ? 24 : 32} />
                </IconButton>
            </Box>

            {/* Ürün Listesi */}
            <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: 3,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                >
                    Öne Çıkan Ürünler
                </Typography>
                <InfiniteScroll
                    dataLength={visibleProducts.length}
                    next={loadMoreProducts}
                    hasMore={hasMore}
                    loader={
                        <Typography sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
                            Yükleniyor...
                        </Typography>
                    }
                >
                    <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                        {visibleProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                <Card
                                    sx={{
                                        boxShadow: 3,
                                        position: "relative",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        "&:hover": {
                                            boxShadow: 8,
                                            transform: "translateY(-8px)",
                                        },
                                    }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            height: { xs: 180, sm: 200, md: 220 },
                                            objectFit: "cover",
                                        }}
                                        image={
                                            product.images && product.images.length > 0
                                                ? Array.isArray(product.images) && typeof product.images[0] === "string"
                                                    ? product.images[0]
                                                    : product.images[0].url
                                                : "https://via.placeholder.com/200"
                                        }
                                        alt={product.name}
                                    />

                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {product.category}
                                        </Typography>
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
                                            {product.name}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mt: "auto",
                                                pt: 2,
                                            }}
                                        >
                                            <Typography variant="h6" color="primary" fontWeight={700}>
                                                {product.price.toLocaleString("tr-TR", {
                                                    style: "currency",
                                                    currency: "TRY",
                                                })}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart({
                                                        id: product.id,
                                                        name: product.name,
                                                        image: product.image,
                                                        price: product.price,
                                                        quantity: 1,
                                                    });
                                                }}
                                                sx={{
                                                    minWidth: "auto",
                                                    px: 1.5,
                                                }}
                                            >
                                                <ShoppingCart size={18} />
                                            </Button>
                                        </Box>
                                    </CardContent>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 12,
                                            right: 12,
                                            backgroundColor: "background.paper",
                                            borderRadius: "50%",
                                            boxShadow: 2,
                                            zIndex: 1,
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product.id);
                                            }}
                                        >
                                            <Heart
                                                size={20}
                                                color={favorites.includes(product.id) ? "red" : "gray"}
                                                fill={favorites.includes(product.id) ? "red" : "none"}
                                            />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </Box>
        </Box>
    );
};

export default Home;
