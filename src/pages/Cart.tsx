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

            await addOrder(order);

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
        <Box sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
        }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                    fontWeight: "bold",
                    color: "text.primary",
                    mb: 3
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
                                boxShadow: "none",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 3,
                                overflow: "hidden"
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                    width: { xs: "100%", sm: 120 },
                                    height: { xs: 200, sm: 120 },
                                    objectFit: "cover",
                                    backgroundColor: "action.hover",
                                }}
                            />
                            <CardContent sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: { xs: "1rem", md: "1.25rem" },
                                        fontWeight: 600,
                                        mb: 1
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "secondary.main",
                                        fontWeight: "bold",
                                        mb: 2,
                                        fontSize: { xs: "0.9rem", md: "1rem" }
                                    }}
                                >
                                    Fiyat: {item.price.toLocaleString("tr-TR", {
                                        style: "currency",
                                        currency: "TRY"
                                    })}
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton
                                            onClick={() => decreaseQuantity(item.id)}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                            }}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{ minWidth: "30px", textAlign: "center", fontWeight: 600 }}>
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            onClick={() => increaseQuantity(item.id)}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        sx={{
                                            color: "#ef4444",
                                            borderColor: "#ef4444",
                                            "&:hover": {
                                                bgcolor: "#fee2e2",
                                                borderColor: "#ef4444"
                                            }
                                        }}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        Kaldır
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                    <Box sx={{ marginTop: 4 }}>
                        <TextField
                            fullWidth
                            label="Teslimat Adresi"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            sx={{ marginBottom: 2 }}
                            multiline
                            rows={3}
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

                    <Box sx={{
                        marginTop: 4,
                        padding: 3,
                        backgroundColor: "background.paper",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Toplam Tutar:
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "secondary.main",
                                    fontWeight: "bold",
                                    fontSize: { xs: "1.25rem", md: "1.5rem" }
                                }}
                            >
                                {totalPrice.toLocaleString("tr-TR", {
                                    style: "currency",
                                    currency: "TRY"
                                })}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: 800,
                            }}
                            onClick={handleOrderSubmit}
                            disabled={cart.length === 0}
                        >
                            Siparişi Tamamla
                        </Button>
                    </Box>
                </>
            ) : (
                <Box sx={{
                    textAlign: "center",
                    py: 8,
                    color: "#64748b"
                }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Sepetiniz boş
                    </Typography>
                    <Typography variant="body2">
                        Alışverişe başlamak için ürünlere göz atın
                    </Typography>
                    <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2.5 }}>
                        Alışverişe başla
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
