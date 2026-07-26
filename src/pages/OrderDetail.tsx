import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Button,
    CardMedia,
    CircularProgress
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders, StoreOrder, updateOrderStatus } from "../services/orderService";
import { fetchProducts } from "../services/productService";
import { CatalogProduct, getProductImage } from "../data/catalog";

const steps = ["Ödeme Bekleniyor", "Onaylandı", "Hazırlanıyor", "Teslim Edildi", "İptal Edildi"];

const getStatusStep = (status: string) => {
    switch (status) {
        case "İptal Edildi": return 4;
        case "Teslim Edildi": return 3;
        case "Hazırlanıyor": return 2;
        case "Onaylandı": return 1;
        default: return 0;
    }
};

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [order, setOrder] = useState<StoreOrder | null>(null);
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            console.log("Giriş yapan kullanıcı ID'si:", user.id);

            Promise.all([
                getOrders(),
                fetchProducts()
            ])
                .then(([allOrders, fetchedProducts]) => {
                    console.log("Tüm Siparişler:", allOrders);
                    console.log("Tüm Ürünler:", fetchedProducts);

                    const selectedOrder = allOrders.find(
                        (candidate) => candidate.userId === user.id && candidate.id === Number(id)
                    );

                    setOrder(selectedOrder || null);
                    setProducts(fetchedProducts);
                })
                .catch((error) => console.error("Sipariş veya ürünler alınırken hata:", error))
                .finally(() => setLoading(false));
        }
    }, [user, id]);

    const handleCancelOrder = () => {
        if (order) {
            console.log("İptal edilecek sipariş ID'si:", order.id);

            updateOrderStatus(order.id, "İptal Edildi")
                .then(() => {
                    console.log("Sipariş başarıyla iptal edildi.");
                    setOrder((prevOrder) => prevOrder ? { ...prevOrder, status: "İptal Edildi" } : null);
                })
                .catch((error) => console.error("Sipariş iptal edilirken hata:", error));
        }
    };

    if (loading) {
        return <Box sx={{ textAlign: "center", marginTop: 5 }}><CircularProgress /></Box>;
    }

    if (!order) {
        console.log("Sipariş bulunamadı veya bu kullanıcıya ait değil.");
        return (
            <Box sx={{ textAlign: "center", marginTop: 5 }}>
                <Typography variant="h6">Sipariş Bulunamadı</Typography>
                <Typography variant="body2">Geçersiz sipariş ID veya siparişiniz bulunmuyor.</Typography>
            </Box>
        );
    }

    const filteredSteps = order.status === "İptal Edildi" ? ["İptal Edildi"] : steps;

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: "auto", boxShadow: 3, borderRadius: 2, backgroundColor: "#fff" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Sipariş Detayı
            </Typography>
            <Divider sx={{ marginBottom: 3 }} />

            <Box sx={{ marginBottom: 4, padding: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="body2">Toplam Tutar: {order.total || 'Bilinmiyor'} TL</Typography>

                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Sipariş Durumu</Typography>
                    <Stepper
                        activeStep={getStatusStep(order.status)}
                        alternativeLabel
                        sx={{ marginTop: 2, "& .MuiStepLabel-label": { color: order.status === "İptal Edildi" ? "red" : "inherit" } }}
                    >
                        {filteredSteps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Ürünler</Typography>
                    <Grid container spacing={2}>
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item) => {
                                const product = products.find((candidate) => candidate.id === item.productId);
                                return (
                                    <Grid item xs={12} key={item.productId}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: 2,
                                                border: "1px solid #ddd",
                                                borderRadius: 2,
                                                backgroundColor: "#f9f9f9",
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={
                                                    product?.images && product.images.length > 0
                                                        ? getProductImage(product)
                                                        : "https://via.placeholder.com/200"
                                                }
                                                alt={product?.name || "Ürün Görseli"}
                                                sx={{ width: 200, marginRight: 2, borderRadius: 2 }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1">{product?.name || "Bilinmeyen Ürün"}</Typography>
                                                <Typography variant="body2">Adet: {item.quantity}</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                {product?.price ? `${product.price} TL` : "Fiyat Bilinmiyor"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Typography variant="body2" color="textSecondary">Ürün bilgisi bulunamadı.</Typography>
                        )}
                    </Grid>
                </Box>

                {order.status !== "Teslim Edildi" && order.status !== "İptal Edildi" && (
                    <Button variant="contained" color="error" sx={{ marginTop: 2 }} onClick={handleCancelOrder}>
                        Siparişi İptal Et
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default OrderDetail;
