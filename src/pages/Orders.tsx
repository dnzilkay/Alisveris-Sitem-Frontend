import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    Divider,
    Button,
    LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders, updateOrderStatus } from "../services/orderService";

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        console.log("Giriş yapan kullanıcı ID'si:", user.id);

        getOrders()
            .then((allOrders) => {
                console.log("Tüm Siparişler:", allOrders);
                const userOrders = allOrders.filter((order: any) => order.userId === user.id);
                setOrders(userOrders);
            })
            .catch((error) => console.error("Siparişler alınırken hata oluştu:", error));
    }, [user]);

    const handleCancelOrder = (orderId: number) => {
        console.log(`Sipariş ${orderId} iptal ediliyor...`);

        updateOrderStatus(orderId, "İptal Edildi")
            .then(() => {
                console.log("Sipariş başarıyla iptal edildi.");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: "İptal Edildi" } : order
                    )
                );
            })
            .catch((error) => console.error("Sipariş iptal edilirken hata oluştu:", error));
    };

    if (orders.length === 0) {
        return (
            <Box sx={{ padding: 4, maxWidth: 600, margin: "auto", textAlign: "center" }}>
                <Typography variant="h6">Henüz bir siparişiniz bulunmamaktadır.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4, maxWidth: 600, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>Siparişlerim</Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <List>
                {orders.map((order) => (
                    <ListItem key={order.id} divider sx={{ alignItems: "flex-start" }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">Toplam: {order.total} TL</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color:
                                        order.status === "Teslim Edildi"
                                            ? "green"
                                            : order.status === "Hazırlanıyor"
                                                ? "orange"
                                                : order.status === "İptal Edildi"
                                                    ? "red"
                                                    : "gray",
                                    fontWeight: "bold",
                                }}
                            >
                                Durum: {order.status}
                            </Typography>

                            {/* İlerleme Çubuğu */}
                            <LinearProgress
                                variant="determinate"
                                value={
                                    order.status === "Teslim Edildi"
                                        ? 100
                                        : order.status === "Hazırlanıyor"
                                            ? 50
                                            : order.status === "İptal Edildi"
                                                ? 0
                                                : 25
                                }
                                sx={{ marginTop: 1 }}
                            />
                        </Box>

                        {/* Detay Butonu */}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/order/${order.id}`)}
                            sx={{ marginLeft: 2 }}
                        >
                            Detayları Gör
                        </Button>

                        {/* İptal Butonu */}
                        {order.status !== "Teslim Edildi" && order.status !== "İptal Edildi" && (
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => handleCancelOrder(order.id)}
                                sx={{ marginLeft: 2 }}
                            >
                                İptal Et
                            </Button>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Orders;
