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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext import edildi
import { getOrders, updateOrderStatus } from "../services/orderService"; // orderService import edildi
import { fetchProducts } from "../services/productService"; // Ürünleri almak için import edildi

// Sipariş Durumları
const steps = ["Ödeme Bekleniyor", "Onaylandı", "Hazırlanıyor", "Teslim Edildi", "İptal Edildi"];

const getStatusStep = (status: string) => {
    if (status === "İptal Edildi") return 4;
    if (status === "Teslim Edildi") return 3;
    if (status === "Hazırlanıyor") return 2;
    if (status === "Onaylandı") return 1;
    return 0;
};

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [order, setOrder] = useState<any | null>(null);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        if (user?.id) {
            console.log("Giriş yapan kullanıcı ID'si:", user.id);

            // Siparişleri al
            getOrders()
                .then((allOrders) => {
                    console.log("Tüm Siparişler:", allOrders);

                    const selectedOrder = allOrders.find(
                        (order: any) => order.userId === user.id && order.id === Number(id)
                    );
                    console.log("Seçilen Sipariş:", selectedOrder);

                    setOrder(selectedOrder || null);
                })
                .catch((error) => console.error("Siparişler alınırken hata:", error));

            // Ürünleri al
            fetchProducts()
                .then((fetchedProducts) => {
                    console.log("Tüm Ürünler:", fetchedProducts);
                    setProducts(fetchedProducts);
                })
                .catch((error) => console.error("Ürünler alınırken hata oluştu:", error));
        }
    }, [user, id]);

    const handleCancelOrder = () => {
        if (order) {
            console.log("İptal edilecek sipariş ID'si:", order.id);

            updateOrderStatus(order.id, "İptal Edildi")
                .then(() => {
                    console.log("Sipariş başarıyla iptal edildi.");
                    setOrder((prevOrder: any) => {
                        if (!prevOrder) return null;
                        return { ...prevOrder, status: "İptal Edildi" };
                    });
                })
                .catch((error) => console.error("Sipariş iptal edilirken hata:", error));
        }
    };

    if (!order) {
        console.log("Sipariş bulunamadı veya bu kullanıcıya ait değil.");
        return <Typography variant="h6" align="center">Sipariş Bulunamadı</Typography>;
    }

    const filteredSteps = order.status === "İptal Edildi" ? ["İptal Edildi"] : steps;

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: "auto", boxShadow: 3, borderRadius: 2, backgroundColor: "#fff" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Sipariş Detayı
            </Typography>
            <Divider sx={{ marginBottom: 3 }} />

            <Box sx={{ marginBottom: 4, padding: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="body2">Toplam Tutar: {order.price || 'Bilinmiyor'} TL</Typography>

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
                        {order.items.map((item: any) => {
                            const product = products.find((p: any) => p.id === item.Product.id);
                            return (
                                <Grid item xs={12} key={item.id}>
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
                                                    ? product.images[0].url // İlk resim URL'sini kullan
                                                    : "https://via.placeholder.com/200" // Varsayılan görsel
                                            }
                                            alt={product?.name || "Ürün Görseli"}
                                            sx={{ width: 200, marginRight: 2, borderRadius: 2 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1">{item.Product.name}</Typography>
                                            <Typography variant="body2">Adet: {item.quantity}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.Product.price} TL</Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>

                {order.status !== "Teslim Edildi" && order.status !== "İptal Edildi" && (
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ marginTop: 2 }}
                        onClick={handleCancelOrder}
                    >
                        Siparişi İptal Et
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default OrderDetail;
