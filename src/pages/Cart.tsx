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
import { useNavigate } from "react-router-dom";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

const Cart: React.FC = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart, completeOrder } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
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
        <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", margin: "0 auto" }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                    color: "primary.main",
                }}
            >
                Sepetim
            </Typography>
            <Divider sx={{ marginBottom: 3 }} />

            {cart.length > 0 ? (
                <>
                    {cart.map((item) => (
                        <Card
                            key={item.id}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                marginBottom: 2,
                                boxShadow: 3,
                                borderRadius: 3,
                                overflow: "hidden",
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                    width: { xs: "100%", sm: 150 },
                                    height: { xs: 200, sm: 150 },
                                    objectFit: "cover",
                                }}
                            />
                            <CardContent
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    p: { xs: 2, sm: 3 },
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 1,
                                            fontSize: { xs: "1rem", sm: "1.25rem" },
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ fontWeight: 700, mb: 2 }}
                                    >
                                        {typeof item.price === "number"
                                            ? item.price.toLocaleString("tr-TR", {
                                                  style: "currency",
                                                  currency: "TRY",
                                              })
                                            : `${item.price} TL`}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton
                                            onClick={() => decreaseQuantity(item.id)}
                                            sx={{
                                                backgroundColor: "action.hover",
                                                "&:hover": { backgroundColor: "action.selected" },
                                            }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography
                                            sx={{
                                                minWidth: "30px",
                                                textAlign: "center",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            onClick={() => increaseQuantity(item.id)}
                                            sx={{
                                                backgroundColor: "action.hover",
                                                "&:hover": { backgroundColor: "action.selected" },
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        variant="outlined"
                                        size="small"
                                        onClick={() => removeItem(item.id)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Kaldır
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                    <Box
                        sx={{
                            marginTop: 4,
                            backgroundColor: "background.paper",
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Teslimat Adresi"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            multiline
                            rows={3}
                            sx={{ marginBottom: 2 }}
                        />
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel>Ödeme Türü</InputLabel>
                            <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                                <MenuItem value="Kart">Kredi/Banka Kartı</MenuItem>
                                <MenuItem value="Kapıda Ödeme">Kapıda Ödeme</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 8,
                        backgroundColor: "background.paper",
                        borderRadius: 3,
                        boxShadow: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Sepetiniz boş
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/")}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        Alışverişe Başla
                    </Button>
                </Box>
            )}

            {cart.length > 0 && (
                <Box
                    sx={{
                        marginTop: 3,
                        padding: 3,
                        backgroundColor: "primary.main",
                        color: "white",
                        borderRadius: 3,
                        boxShadow: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Toplam Tutar:
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {totalPrice.toLocaleString("tr-TR", {
                                style: "currency",
                                currency: "TRY",
                            })}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "white",
                            color: "primary.main",
                            py: 1.5,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "grey.100",
                            },
                        }}
                        onClick={handleOrderSubmit}
                        disabled={cart.length === 0}
                    >
                        Siparişi Tamamla
                    </Button>
                </Box>
            )}

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
