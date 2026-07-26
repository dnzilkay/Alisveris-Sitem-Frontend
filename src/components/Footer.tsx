import React from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FooterLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
    <Link
        component="button"
        type="button"
        onClick={onClick}
        color="inherit"
        underline="none"
        sx={{ width: "fit-content", color: "grey.400", "&:hover": { color: "white" } }}
    >
        {label}
    </Link>
);

const Footer: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box component="footer" sx={{ mt: "auto", bgcolor: "#111827", color: "white" }}>
            <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h5" fontWeight={900} letterSpacing="-0.04em">
                            NOVA.
                        </Typography>
                        <Typography color="grey.400" sx={{ mt: 1.5, maxWidth: 430, lineHeight: 1.75 }}>
                            Günlük hayat için seçilmiş teknoloji, ev, giyim ve aksesuar ürünlerini
                            sade bir alışveriş deneyimiyle bir araya getiriyoruz.
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 3, mb: 1 }}>
                            Yeni ürün ve fırsatlardan haberdar ol
                        </Typography>
                        <Stack
                            component="form"
                            onSubmit={(event) => event.preventDefault()}
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{ maxWidth: 460 }}
                        >
                            <TextField
                                type="email"
                                placeholder="E-posta adresin"
                                size="small"
                                fullWidth
                                inputProps={{ "aria-label": "E-posta adresi" }}
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 1.5,
                                    "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                                }}
                            />
                            <Button variant="contained" color="secondary" sx={{ whiteSpace: "nowrap" }}>
                                Kaydol
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Typography fontWeight={800} sx={{ mb: 2 }}>Mağaza</Typography>
                        <Stack spacing={1.25}>
                            <FooterLink label="Yeni gelenler" onClick={() => navigate("/new-products")} />
                            <FooterLink label="Çok satanlar" onClick={() => navigate("/best-sellers")} />
                            <FooterLink label="Fırsatlar" onClick={() => navigate("/discounts")} />
                            <FooterLink label="Tüm ürünler" onClick={() => navigate("/search")} />
                        </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Typography fontWeight={800} sx={{ mb: 2 }}>Hesabım</Typography>
                        <Stack spacing={1.25}>
                            <FooterLink label="Profilim" onClick={() => navigate("/profile")} />
                            <FooterLink label="Siparişlerim" onClick={() => navigate("/orders")} />
                            <FooterLink label="Sepetim" onClick={() => navigate("/cart")} />
                            <FooterLink label="Giriş yap" onClick={() => navigate("/auth")} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Typography fontWeight={800} sx={{ mb: 2 }}>Alışveriş desteği</Typography>
                        <Stack spacing={1.25} color="grey.400">
                            <Typography variant="body2">Hafta içi 09.00–18.00</Typography>
                            <Typography variant="body2">14 gün kolay iade</Typography>
                            <Typography variant="body2">Güvenli ödeme altyapısı</Typography>
                            <Typography variant="body2">Demo mağaza deneyimi</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,.12)" }} />
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                    color="grey.500"
                >
                    <Typography variant="caption">© 2026 NOVA. Demo e-ticaret uygulaması.</Typography>
                    <Typography variant="caption">Fiyatlar ve ürünler tanıtım amaçlıdır.</Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
