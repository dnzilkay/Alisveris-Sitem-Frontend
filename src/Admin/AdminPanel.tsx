import React, { useState } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CategoryIcon from "@mui/icons-material/Category";
import AdminDashboard from "./adminDashboard";
import AdminUsers from "./adminUsers";
import AdminProducts from "./adminProducts";
import AdminOrders from "./adminOrders";
import AdminCategories from "./adminCategories";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const drawerWidth = 240;

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { toggleTheme, darkMode } = useThemeContext();
    const navigate = useNavigate();

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return <AdminDashboard />;
            case 1:
                return <AdminUsers />;
            case 2:
                return <AdminProducts />;
            case 3:
                return <AdminOrders />;
            case 4:
                return <AdminCategories />;
            default:
                return <Typography>Bir sorun oluştu.</Typography>;
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#1E88E5",
                        color: "white",
                    },
                }}
            >
                <Typography variant="h5" align="center" sx={{ my: 2 }}>
                    Admin Panel
                </Typography>
                <List>
                    {["Dashboard", "Users", "Products", "Orders", "Categories"].map((text, index) => (
                       //@ts-ignore
                        <ListItem
                            button
                            key={text}
                            onClick={() => setActiveTab(index)}
                            sx={{
                                backgroundColor: activeTab === index ? "#90CAF9" : "inherit",
                                "&:hover": { backgroundColor: "#64B5F6" },
                                color: activeTab === index ? "white" : "inherit",
                                borderRadius: 1,
                                mb: 1,
                            }}
                        >
                            <IconButton>
                                {index === 0 ? (
                                    <DashboardIcon />
                                ) : index === 1 ? (
                                    <PeopleIcon />
                                ) : index === 2 ? (
                                    <InventoryIcon />
                                ) : index === 3 ? (
                                    <ReceiptIcon />
                                ) : (
                                    <CategoryIcon />
                                )}
                            </IconButton>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1 }}>

                {/* Üst Navigasyon */}
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: "#1E88E5",
                        color: "white",
                        boxShadow: 2,
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Admin Panel
                        </Typography>
                        {/* Tema Değiştirme */}
                        <DarkModeSwitch
                            checked={darkMode}
                            onChange={toggleTheme}
                            size={30}
                            moonColor="#FFD700"
                            sunColor="#FFA500"
                        />
                        <IconButton color="inherit"
                                    onClick={() => navigate("/")}>
                            <HomeIcon />
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                Anasayfaya Dön
                            </Typography>
                        </IconButton>

                    </Toolbar>
                </AppBar>

                {/* Sekme İçeriği */}
                <Box sx={{ p: 3 }}>{renderTabContent()}</Box>
            </Box>
        </Box>
    );
};

export default AdminPanel;
