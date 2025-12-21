import React from "react";
import { Box, Typography, Grid, Link, Divider } from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();

    return (
        <Box
            component="footer"
            sx={{
                background: darkMode
                    ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: { xs: "30px 20px", md: "40px 0" },
                marginTop: "auto",
            }}
        >
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: "0 20px", md: "0 40px" } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>
                    {/* Hızlı Linkler */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: "1.1rem", md: "1.25rem" },
                            }}
                        >
                            Hızlı Bağlantılar
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Link
                                component="button"
                                onClick={() => navigate("/")}
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    textAlign: "left",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                    cursor: "pointer",
                                }}
                            >
                                Anasayfa
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate("/new-products")}
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    textAlign: "left",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                    cursor: "pointer",
                                }}
                            >
                                Yeni Ürünler
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate("/discounts")}
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    textAlign: "left",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                    cursor: "pointer",
                                }}
                            >
                                İndirimler
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate("/best-sellers")}
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    textAlign: "left",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                    cursor: "pointer",
                                }}
                            >
                                Çok Satanlar
                            </Link>
                        </Box>
                    </Grid>

                    {/* İletişim */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: "1.1rem", md: "1.25rem" },
                            }}
                        >
                            İletişim
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                                📍 Adres: 123 Alışveriş Caddesi, İstanbul
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                                📞 Telefon: +90 123 456 78 90
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                                ✉️ Email: info@alisverissitesi.com
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Sosyal Medya */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: "1.1rem", md: "1.25rem" },
                            }}
                        >
                            Bizi Takip Edin
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Link
                                href="#"
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                }}
                            >
                                Facebook
                            </Link>
                            <Link
                                href="#"
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                }}
                            >
                                Twitter
                            </Link>
                            <Link
                                href="#"
                                sx={{
                                    color: "rgba(255,255,255,0.9)",
                                    textDecoration: "none",
                                    "&:hover": { color: "#fff", textDecoration: "underline" },
                                }}
                            >
                                Instagram
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Alt Çizgi ve Kopya Hakkı */}
            <Divider
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    marginY: { xs: "20px", md: "30px" },
                }}
            />
            <Typography
                align="center"
                variant="body2"
                sx={{
                    paddingTop: "10px",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                }}
            >
                © 2024 Alışveriş Sitesi. Tüm Hakları Saklıdır.
            </Typography>
        </Box>
    );
};

export default Footer;
