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
import { useCart } from "../context/CartContext"; // Sepet context'i kullanılıyor
import { useAuth } from "../context/AuthContext"; // Auth context'i kullanılıyor
import { addOrder } from "../services/orderService"; // Sipariş ekleme servisi

const Cart: React.FC = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart, completeOrder } = useCart();
    const { user } = useAuth(); // Kullanıcı bilgilerini al
    const [address, setAddress] = useState("");
    const [paymentType, setPaymentType] = useState("Kart");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    // Toplam Tutar Hesaplama
    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    // Sipariş Gönderme
    const handleOrderSubmit = async () => {
        console.log("AuthContext Kullanıcı:", user);

        if (!address.trim()) {
            setSnackbarMessage("Adres alanı boş olamaz!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        if (!user || typeof user.id !== "number" || isNaN(user.id)) { // Kullanıcı ID'sini kontrol et
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
                userId: userId, // Kullanıcı ID'si
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                deliveryAddress: address.trim(),
                paymentType,
                price: Number(totalPrice.toFixed(2)), // Tam sayı veya iki basamaklı float olarak fiyat gönder
            };

            console.log("Gönderilecek Sipariş Verisi:", order); // Debug için log

            await addOrder(order); // Backend'e sipariş gönder

            // Siparişi tamamla ve satış miktarlarını artır
            completeOrder();

            setSnackbarMessage("Sipariş başarıyla oluşturuldu!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            clearCart(); // Sepeti boşalt
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

            {/* Ödeme ve Adres Alanları */}
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

            {/* Toplam Tutar ve Ödeme */}
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

            {/* Snackbar */}
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
