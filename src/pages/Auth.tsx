import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { registerUser } from "../services/authService"; // Sadece register işlemi burada
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { login } = useAuth(); // AuthContext üzerinden login fonksiyonunu alıyoruz
    const navigate = useNavigate();

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
        setError("");
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError("E-posta ve şifre boş bırakılamaz!");
            return;
        }

        try {
            // **Login işlemi artık doğrudan `useAuth().login()` üzerinden çağrılıyor**
            await login(email, password);
            setSuccess(true);
            setError("");

            navigate("/"); // Başarıyla giriş yaptıktan sonra yönlendir
        } catch (err) {
            console.error("Giriş hatası:", err);
            setError("Giriş başarısız, bilgilerinizi kontrol edin.");
        }
    };

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError("Tüm alanları doldurun!");
            return;
        }

        try {
            await registerUser({ username, email, password });

            setTabIndex(0);
            setSuccess(true);
            setError("");
            navigate("/");
        } catch (err) {
            console.error("Kayıt hatası:", err);
            setError("Kayıt başarısız, bilgilerinizi kontrol edin.");
        }
    };

    return (
        <Box sx={{
            maxWidth: { xs: "100%", sm: 450 },
            width: "100%",
            margin: "auto",
            marginTop: { xs: 2, md: 5 },
            padding: { xs: 2, sm: 3 },
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            borderRadius: 2,
            backgroundColor: "#ffffff"
        }}>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                centered
                sx={{
                    "& .MuiTab-root": {
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        minWidth: { xs: 100, md: 120 }
                    }
                }}
            >
                <Tab label="Giriş Yap" />
                <Tab label="Kayıt Ol" />
            </Tabs>

            {tabIndex === 0 && (
                <Box sx={{ marginTop: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: 600,
                            color: "#1e293b",
                            mb: 2
                        }}
                    >
                        Giriş Yap
                    </Typography>
                    <TextField
                        fullWidth
                        label="E-posta"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Şifre"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            bgcolor: "#6366f1",
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": { bgcolor: "#4f46e5" },
                            textTransform: "none"
                        }}
                    >
                        Giriş Yap
                    </Button>
                </Box>
            )}

            {tabIndex === 1 && (
                <Box sx={{ marginTop: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: 600,
                            color: "#1e293b",
                            mb: 2
                        }}
                    >
                        Kayıt Ol
                    </Typography>
                    <TextField
                        fullWidth
                        label="Kullanıcı Adı"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="E-posta"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Şifre"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleRegister}
                        sx={{
                            bgcolor: "#ec4899",
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": { bgcolor: "#db2777" },
                            textTransform: "none"
                        }}
                    >
                        Kayıt Ol
                    </Button>
                </Box>
            )}

            {error && (
                <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
                    <Alert severity="error" onClose={() => setError("")}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {success && (
                <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                    <Alert severity="success" onClose={() => setSuccess(false)}>
                        İşlem başarılı!
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default Auth;
