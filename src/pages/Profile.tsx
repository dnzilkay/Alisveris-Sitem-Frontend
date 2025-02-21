import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Divider, IconButton, InputAdornment, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext"; // AuthContext'ten kullanıcı bilgileri al
import { getUsers } from "../services/userService"; // Tüm kullanıcıları alacak olan servisi ekliyoruz

const Profile: React.FC = () => {
    const { user, logout } = useAuth(); // AuthContext'ten kullanıcı bilgilerini ve logout fonksiyonunu alıyoruz
    const [showPassword, setShowPassword] = useState(false); // Şifreyi görme/gizleme durumu
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        password: "********", // Şifreyi gizle
    });

    useEffect(() => {
        // Kullanıcı giriş yaptıysa, tüm kullanıcıları alıyoruz ve giriş yapan kullanıcıyı filtreliyoruz
        if (user) {
            const fetchUserData = async () => {
                try {
                    // Tüm kullanıcıları alıyoruz
                    const users = await getUsers();
                    // Giriş yapan kullanıcının ID'siyle eşleşen kullanıcıyı filtreliyoruz
                    // @ts-ignore
                    const currentUser = users.find((u) => u.id === user.id);

                    // Bulunan kullanıcının verilerini profileData'ya set ediyoruz
                    if (currentUser) {
                        setProfileData({
                            username: currentUser.username,
                            email: currentUser.email,
                            password: "********", // Şifreyi gizli tutuyoruz
                        });
                    }
                } catch (error) {
                    console.error("Kullanıcı bilgileri alınırken hata oluştu", error);
                }
            };

            fetchUserData();
        }
    }, [user]); // `user` değiştiğinde bu işlemi tekrar yapacak

    // Şifreyi görme/gizleme fonksiyonu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Çıkış yapma fonksiyonu
    const handleLogout = () => {
        logout();
    };

    if (!user) {
        return <Typography>Yükleniyor...</Typography>;
    }

    return (
        <Box sx={{ padding: 4, maxWidth: 500, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Profil Bilgileri
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Kullanıcı Adı */}
            <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={profileData.username}
                disabled
                margin="normal"
            />
            {/* E-posta */}
            <TextField
                fullWidth
                label="E-posta"
                name="email"
                value={profileData.email}
                disabled
                margin="normal"
            />
            {/* Şifre */}
            <TextField
                fullWidth
                label="Şifre"
                name="password"
                type={showPassword ? "text" : "password"}
                value={profileData.password}
                disabled
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Çıkış Yap Butonu */}
            <Button
                variant="contained"
                color="error" // Kırmızı renk için "error" kullanıyoruz
                fullWidth
                onClick={handleLogout}
                sx={{ marginTop: 2 }}
            >
                Çıkış Yap
            </Button>
        </Box>
    );
};

export default Profile;
