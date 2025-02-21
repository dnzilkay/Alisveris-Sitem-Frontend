src/
├── Admin/                   # Yönetici paneli bileşenleri
│   ├── adminCategories.tsx  # Kategori yönetimi bileşeni
│   ├── adminDashboard.tsx   # Yönetici ana paneli bileşeni
│   ├── adminOrders.tsx      # Sipariş yönetimi bileşeni
│   ├── AdminPanel.tsx       # Ana yönetici paneli bileşeni
│   ├── adminProducts.tsx    # Ürün yönetimi bileşeni
│   └── adminUsers.tsx       # Kullanıcı yönetimi bileşeni
├── components/               # Tekrar kullanılabilir bileşenler
│   ├── Footer.tsx            # Footer bileşeni
│   ├── HomeNavbar.tsx        # Ana sayfa için özel Navbar
│   ├── Navbar.tsx            # Genel Navbar bileşeni
│   └── SearchBar.tsx         # Arama çubuğu bileşeni
├── context/                  # Context API ile durum yönetimi
│   ├── AuthContext.tsx       # Kullanıcı giriş durumu
│   ├── CartContext.tsx       # Sepet durumu
│   └── ThemeContext.tsx      # Koyu/Açık mod durumu
├── pages/                    # Sayfa bileşenleri
│   ├── Auth.tsx              # Giriş ve kayıt işlemleri
│   ├── Cart.tsx              # Sepet sayfası
│   ├── CategoryPage.tsx      # Kategori sayfası
│   ├── Home.tsx              # Ana sayfa (Ürün listesi)
│   ├── OrderDetail.tsx       # Sipariş detay sayfası
│   ├── Orders.tsx            # Siparişler sayfası
│   ├── ProductDetail.tsx     # Ürün detay sayfası
│   └── Profile.tsx           # Kullanıcı profili sayfası
├── services/                 # API çağrıları
│   ├── authService.ts        # Kimlik doğrulama API'leri
│   ├── categoryService.ts    # Kategori API'leri
│   ├── orderService.ts       # Sipariş API'leri
│   ├── productService.ts     # Ürün API'leri
│   └── userService.ts        # Kullanıcı API'leri
├── styles/                   # Proje genelinde kullanılacak özel stiller
│   └── global.css            # Global CSS dosyası
├── App.tsx                   # Ana bileşen
├── main.tsx                  # React DOM render işlemi
├── apiClient.ts              # API çağrılarını yöneten genel dosya
├── vite-env.d.ts             # Vite tarafından sağlanan tür tanımları