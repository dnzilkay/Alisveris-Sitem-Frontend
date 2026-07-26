import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Rating,
    Stack,
    Typography,
} from "@mui/material";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CatalogProduct, getProductImage } from "../data/catalog";
import { useFavorites } from "../context/favoritesContext";

interface ProductCardProps {
    product: CatalogProduct;
}

const formatPrice = (price: number) =>
    price.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { favorites, toggleFavorite } = useFavorites();
    const productImage = getProductImage(product);
    const favorite = favorites.includes(product.id);

    return (
        <Card
            onClick={() => navigate(`/product/${product.id}`)}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: "none",
                cursor: "pointer",
                overflow: "hidden",
                transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "transparent",
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                },
            }}
        >
            <Box sx={{ position: "relative", bgcolor: "grey.50", overflow: "hidden" }}>
                <CardMedia
                    component="img"
                    image={productImage}
                    alt={product.name}
                    sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        transition: "transform 300ms ease",
                        ".MuiCard-root:hover &": { transform: "scale(1.025)" },
                    }}
                />
                {product.badge && (
                    <Chip
                        label={product.badge}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                        }}
                    />
                )}
                <IconButton
                    aria-label={favorite ? `${product.name} favorilerden çıkar` : `${product.name} favorilere ekle`}
                    onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(product.id);
                    }}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        bgcolor: "rgba(255,255,255,.92)",
                        color: favorite ? "error.main" : "text.secondary",
                        "&:hover": { bgcolor: "white" },
                    }}
                >
                    <Heart size={19} fill={favorite ? "currentColor" : "none"} />
                </IconButton>
            </Box>

            <CardContent sx={{ p: 2.25, display: "flex", flex: 1, flexDirection: "column" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {product.category}
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 0.5,
                        fontWeight: 700,
                        lineHeight: 1.35,
                        minHeight: "2.7em",
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                    }}
                >
                    {product.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.75,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                    }}
                >
                    {product.shortDescription}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.5 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                        ({product.reviewCount})
                    </Typography>
                </Stack>
                <Box sx={{ mt: "auto", pt: 2 }}>
                    {product.oldPrice && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                        >
                            {formatPrice(product.oldPrice)}
                        </Typography>
                    )}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography variant="h6" fontWeight={800}>
                            {formatPrice(product.price)}
                        </Typography>
                        <Button
                            aria-label={`${product.name} ürününü sepete ekle`}
                            variant="contained"
                            onClick={(event) => {
                                event.stopPropagation();
                                addToCart({
                                    id: product.id,
                                    name: product.name,
                                    image: productImage,
                                    price: product.price,
                                    quantity: 1,
                                });
                            }}
                            sx={{ minWidth: 44, px: 1.25 }}
                        >
                            <ShoppingBag size={18} />
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
