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
        <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            {/* Alt Navbar */}
            <HomeNavbar />

            {/* Carousel */}
            <Box sx={{ position: "relative", height: "400px", overflow: "hidden" }}>
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
                                backgroundColor: "rgba(0,0,0,0.4)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                            }}
                        >
                            <Typography variant="h3" fontWeight="bold" mb={2}>
                                {slide.title}
                            </Typography>
                            <Typography variant="h6">{slide.description}</Typography>
                        </Box>
                    </Box>
                ))}
                <Button
                    onClick={prevSlide}
                    sx={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "white" }}
                >
                    <ChevronLeft size={32} />
                </Button>
                <Button
                    onClick={nextSlide}
                    sx={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "white" }}
                >
                    <ChevronRight size={32} />
                </Button>
            </Box>

            {/* Ürün Listesi */}
            <Box sx={{ padding: 3 }}>
                <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center" }}>
                    Öne Çıkan Ürünler
                </Typography>
                <InfiniteScroll
                    dataLength={visibleProducts.length}
                    next={loadMoreProducts}
                    hasMore={hasMore}
                    loader={<Typography>Yükleniyor...</Typography>}
                >
                    <Grid container spacing={3}>
                        {visibleProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card
                                    sx={{
                                        boxShadow: 3,
                                        position: "relative",
                                        cursor: "pointer",
                                        transition: "transform 0.3s",
                                        "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                                    }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={
                                            product.images && product.images.length > 0
                                                ? Array.isArray(product.images) && typeof product.images[0] === "string"
                                                    ? product.images[0] // Eğer `images[0]` bir `string` ise, direkt kullan
                                                    : product.images[0].url // Eğer `images[0]` bir `object` ise, `.url` özelliğini kullan
                                                : "https://via.placeholder.com/200" // Varsayılan resim
                                        }
                                        alt={product.name}
                                    />

                                    <CardContent>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            {product.category}
                                        </Typography>
                                        <Typography variant="h6" noWrap>
                                            {product.name}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography variant="h6" color="primary">
                                                {product.price.toLocaleString("tr-TR", {
                                                    style: "currency",
                                                    currency: "TRY",
                                                })}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
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
                                            >
                                                <ShoppingCart size={18} />
                                            </Button>
                                        </Box>
                                    </CardContent>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 9,
                                            right: 9,
                                            backgroundColor: "white",
                                            borderRadius: "50%",
                                            boxShadow: 1,
                                        }}
                                    >
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product.id);
                                            }}
                                        >
                                            <Heart
                                                size={25}
                                                color={favorites.includes(product.id) ? "red" : "gray"}
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
