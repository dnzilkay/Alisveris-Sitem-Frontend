import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Chart.js bileşenlerini başlat
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Örnek Grafik Verileri
const chartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
        {
            label: "Aylık Gelir (₺)",
            data: [15000, 20000, 18000, 22000, 25000, 30000],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
    ],
};

// Örnek Kart Verileri
const stats = [
    { title: "Toplam Kullanıcı", value: 120, color: "#42A5F5" },
    { title: "Toplam Sipariş", value: 365, color: "#66BB6A" },
    { title: "Toplam Ürün", value: 78, color: "#FF7043" },
    { title: "Toplam Gelir", value: "₺ 1,235,000", color: "#AB47BC" },
];

const AdminDashboard: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {/* Kartlar */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            sx={{
                                p: 3,
                                textAlign: "center",
                                backgroundColor: stat.color,
                                color: "white",
                                borderRadius: 2,
                                boxShadow: 2,
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    transition: "transform 0.3s ease",
                                },
                            }}
                        >
                            <Typography variant="h6">{stat.title}</Typography>
                            <Typography variant="h4">{stat.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Gelir Grafiği */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Aylık Gelir
                </Typography>
                <Bar data={chartData} />
            </Paper>
        </Box>
    );
};

export default AdminDashboard;
