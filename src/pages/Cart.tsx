import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Divider,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addOrder } from "../services/orderService";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

const Cart: React.FC = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart, completeOrder } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState("");
    const [paymentType, setPaymentType] = useState("Kart");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    // Toplam Tutar Hesaplama
    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    // Sipariş Gönderme (Backend veya Mock)
    const handleOrderSubmit = async () => {
        console.log("AuthContext Kullanıcı:", user);

        if (!address.trim()) {
            setSnackbarMessage("Adres alanı boş olamaz!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        if (!user || typeof user.id !== "number" || isNaN(user.id)) {
            setSnackbarMessage("Kullanıcı bilgisi eksik. Lütfen giriş yapın.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Kullanıcı ID'si eksik veya geçersiz:", user);
            return;
        }

        try {
            const userId = Number(user.id);
            if (isNaN(userId)) {
                setSnackbarMessage("Geçersiz kullanıcı ID'si.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                console.error("Geçersiz kullanıcı ID'si:", user.id);
                return;
            }

            const order = {
                userId: userId,
                total: Number(totalPrice.toFixed(2)), // "price" yerine "total" kullanılıyor
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            console.log("Gönderilecek Sipariş Verisi:", order);

            if (useBackend) {
                await addOrder(order);
            } else {
                console.log("Mock Sipariş Eklendi:", order);
            }

            completeOrder();

            setSnackbarMessage("Sipariş başarıyla oluşturuldu!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            clearCart();
        } catch (error) {
            console.error("Sipariş gönderim hatası:", error);
            setSnackbarMessage("Sipariş gönderilirken bir hata oluştu.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Sepetim</Typography>
            <Divider sx={{ marginBottom: 2 }} />

            {cart.length > 0 ? (
                cart.map((item) => (
                    <Card key={item.id} sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
                        <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.name}
                            sx={{ width: 120, objectFit: "contain" }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography>Fiyat: {item.price.toLocaleString()} TL</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                                <IconButton onClick={() => decreaseQuantity(item.id)}>
                                    <RemoveIcon />
                                </IconButton>
                                <Typography>{item.quantity}</Typography>
                                <IconButton onClick={() => increaseQuantity(item.id)}>
                                    <AddIcon />
                                </IconButton>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    sx={{ marginLeft: "auto" }}
                                    onClick={() => removeItem(item.id)}
                                >
                                    Kaldır
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>Sepetiniz boş.</Typography>
            )}

            {cart.length > 0 && (
                <Box sx={{ marginTop: 4 }}>
                    <TextField
                        fullWidth
                        label="Teslimat Adresi"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Ödeme Türü</InputLabel>
                        <Select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                        >
                            <MenuItem value="Kart">Kart</MenuItem>
                            <MenuItem value="Kapıda Ödeme">Kapıda Ödeme</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            <Box sx={{ textAlign: "right", marginTop: 3 }}>
                <Typography variant="h6">Toplam Tutar: {totalPrice.toLocaleString()} TL</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 1 }}
                    onClick={handleOrderSubmit}
                    disabled={cart.length === 0}
                >
                    Siparişi Tamamla
                </Button>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Cart;
