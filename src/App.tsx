import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminPanel from "./Admin/AdminPanel";
import { ThemeContextProvider } from "./context/ThemeContext";
import CategoryPage from "./pages/CategoryPage";
import { CartProvider } from "./context/CartContext";
import  OrderDetail  from "./pages/OrderDetail";
import { AuthProvider } from "./context/AuthContext";

// Yeni Sayfa Bileşenleri (Placeholder olarak tanımladım)
const NewProducts = () => <div style={{ padding: "20px" }}>Yeni Ürünler Sayfası</div>;
const Discounts = () => <div style={{ padding: "20px" }}>İndirimler Sayfası</div>;
const BestSellers = () => <div style={{ padding: "20px" }}>Çok Satanlar Sayfası</div>;
const Campaigns = () => <div style={{ padding: "20px" }}>Kampanyalar Sayfası</div>;

// Navbar'ı admin panelinde gizlemek için bir wrapper component oluşturuyoruz.
const AppContent: React.FC = () => {
    const location = useLocation();

    // Admin sayfasında mıyız?
    const isAdminPage = location.pathname === "/admin";

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Navbar sadece admin paneli dışında gösterilir */}
            {!isAdminPage && <Navbar />}

            {/* Sayfa İçerikleri */}
            <div style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/new-products" element={<NewProducts />} />
                    <Route path="/discounts" element={<Discounts />} />
                    <Route path="/best-sellers" element={<BestSellers />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    {/*Test İçerikleri */}


                    {/* Admin Paneli */}
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
            </div>

            {/* Footer sadece admin paneli dışında gösterilir */}
            {!isAdminPage && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
        <ThemeContextProvider>
            <CartProvider>
                <Router>
                    <AppContent />
                </Router>
            </CartProvider>
        </ThemeContextProvider>
        </AuthProvider>
    );
};

export default App;
