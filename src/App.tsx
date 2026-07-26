import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { ThemeContextProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesProvider";

const Auth = lazy(() => import("./pages/Auth"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const AdminPanel = lazy(() => import("./Admin/AdminPanel"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));

// Navbar'ı admin panelinde gizlemek için bir wrapper component oluşturuyoruz.
const AppContent: React.FC = () => {
    const location = useLocation();

    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {!isAdminPage && <Navbar />}

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Suspense
                    fallback={
                        <Box sx={{ minHeight: "55vh", display: "grid", placeItems: "center", color: "text.secondary" }}>
                            Mağaza hazırlanıyor…
                        </Box>
                    }
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/search" element={<CollectionPage />} />
                        <Route path="/new-products" element={<CollectionPage mode="new" />} />
                        <Route path="/discounts" element={<CollectionPage mode="discounts" />} />
                        <Route path="/best-sellers" element={<CollectionPage mode="best-sellers" />} />
                        <Route path="/campaigns" element={<Navigate to="/discounts" replace />} />
                        <Route path="/favorites" element={<CollectionPage mode="favorites" />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/order/:id" element={<OrderDetail />} />
                        <Route path="/category/:id" element={<CategoryPage />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Box>

            {!isAdminPage && <Footer />}
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeContextProvider>
                <CartProvider>
                    <FavoritesProvider>
                        <Router>
                            <AppContent />
                        </Router>
                    </FavoritesProvider>
                </CartProvider>
            </ThemeContextProvider>
        </AuthProvider>
    );
};

export default App;
