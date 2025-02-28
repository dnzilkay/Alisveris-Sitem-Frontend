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
        <Box sx={{ maxWidth: 400, margin: "auto", marginTop: 5, padding: 3, boxShadow: 3, borderRadius: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Giriş Yap" />
                <Tab label="Kayıt Ol" />
            </Tabs>

            {tabIndex === 0 && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Giriş Yap
                    </Typography>
                    <TextField
                        fullWidth
                        label="E-posta"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Şifre"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                        Giriş Yap
                    </Button>
                </Box>
            )}

            {tabIndex === 1 && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Kayıt Ol
                    </Typography>
                    <TextField
                        fullWidth
                        label="Kullanıcı Adı"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="E-posta"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Şifre"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="secondary" fullWidth onClick={handleRegister}>
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
