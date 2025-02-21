import React from "react";
import { Box, Typography, Grid, Link, Divider } from "@mui/material";

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#1976D2",
                color: "#fff",
                padding: "20px 0",
                marginTop: "30px",
            }}
        >
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
                <Grid container spacing={3}>
                    {/* Hızlı Linkler */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Hızlı Bağlantılar
                        </Typography>
                        <Link href="/" color="inherit" underline="hover">
                            Anasayfa
                        </Link>
                        <br />
                        <Link href="/new-products" color="inherit" underline="hover">
                            Yeni Ürünler
                        </Link>
                        <br />
                        <Link href="/discounts" color="inherit" underline="hover">
                            İndirimler
                        </Link>
                        <br />
                        <Link href="/best-sellers" color="inherit" underline="hover">
                            Çok Satanlar
                        </Link>
                    </Grid>

                    {/* İletişim */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            İletişim
                        </Typography>
                        <Typography variant="body2">
                            Adres: 123 Alışveriş Caddesi, İstanbul
                        </Typography>
                        <Typography variant="body2">Telefon: +90 123 456 78 90</Typography>
                        <Typography variant="body2">Email: info@alisverissitesi.com</Typography>
                    </Grid>

                    {/* Sosyal Medya */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Bizi Takip Edin
                        </Typography>
                        <Link href="#" color="inherit" underline="hover">
                            Facebook
                        </Link>
                        <br />
                        <Link href="#" color="inherit" underline="hover">
                            Twitter
                        </Link>
                        <br />
                        <Link href="#" color="inherit" underline="hover">
                            Instagram
                        </Link>
                    </Grid>
                </Grid>
            </Box>

            {/* Alt Çizgi ve Kopya Hakkı */}
            <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", marginY: "10px" }} />
            <Typography align="center" variant="body2" sx={{ paddingTop: "10px" }}>
                © 2024 Alışveriş Sitesi. Tüm Hakları Saklıdır.
            </Typography>
        </Box>
    );
};

export default Footer;
