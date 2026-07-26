export interface CatalogCategory {
    id: number;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
}

export interface ProductImage {
    id: number;
    url: string;
    productId: number;
}

export interface CatalogProduct {
    id: number;
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    oldPrice?: number;
    stock: number;
    sold: number;
    categoryId: number;
    category: string;
    images: ProductImage[];
    isActive: boolean;
    rating: number;
    reviewCount: number;
    badge?: string;
    features: string[];
    isNew?: boolean;
}

export const catalogCategories: CatalogCategory[] = [
    {
        id: 1,
        name: "Elektronik",
        description: "Günlük tempoya ayak uyduran ses, çalışma ve akıllı yaşam ürünleri.",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=82&w=900",
        isActive: true,
    },
    {
        id: 2,
        name: "Ev & Yaşam",
        description: "Evin ritmini sadeleştiren işlevsel ve zamansız parçalar.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=82&w=900",
        isActive: true,
    },
    {
        id: 3,
        name: "Giyim",
        description: "Kolay kombinlenen, rahat ve mevsimsiz gardırop seçkisi.",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=82&w=900",
        isActive: true,
    },
    {
        id: 4,
        name: "Outdoor",
        description: "Şehirden hafta sonu rotalarına uzanan dayanıklı ürünler.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=82&w=900",
        isActive: true,
    },
    {
        id: 5,
        name: "Aksesuar",
        description: "Günlük hayatın küçük ama etkili tamamlayıcıları.",
        image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&q=82&w=900",
        isActive: true,
    },
];

const image = (productId: number, url: string): ProductImage => ({
    id: productId,
    productId,
    url,
});

export const catalogProducts: CatalogProduct[] = [
    {
        id: 1,
        name: "Aura ANC Kablosuz Kulaklık",
        description:
            "Aura, aktif gürültü engelleme ve dengeli ses profiliyle işe odaklanırken, yolculukta veya günün sonunda kesintisiz dinleme deneyimi sunar.",
        shortDescription: "40 saat pil ömrü ve aktif gürültü engelleme.",
        price: 4799,
        oldPrice: 5499,
        stock: 18,
        sold: 142,
        categoryId: 1,
        category: "Elektronik",
        images: [
            image(
                1,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.8,
        reviewCount: 126,
        badge: "Editörün seçimi",
        features: ["Aktif gürültü engelleme", "40 saate kadar kullanım", "USB-C hızlı şarj"],
        isNew: true,
    },
    {
        id: 2,
        name: "Pulse Akıllı Saat",
        description:
            "Pulse; günlük aktivite, uyku ve bildirim takibini sade bir arayüzle bir araya getirir. Hafif gövdesi sayesinde gün boyu rahatça kullanılabilir.",
        shortDescription: "Uyku, aktivite ve bildirim takibi tek ekranda.",
        price: 2899,
        oldPrice: 3299,
        stock: 12,
        sold: 97,
        categoryId: 1,
        category: "Elektronik",
        images: [
            image(
                2,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.6,
        reviewCount: 84,
        badge: "Çok satan",
        features: ["7 güne kadar pil", "Suya dayanıklı gövde", "Sağlık ve aktivite takibi"],
    },
    {
        id: 3,
        name: "Flow Mekanik Klavye",
        description:
            "Flow, kompakt yüzde 75 yerleşimi, sessiz mekanik anahtarları ve kablosuz bağlantısıyla masaüstünde daha düzenli bir çalışma alanı oluşturur.",
        shortDescription: "Kompakt gövde, sessiz tuşlar ve çoklu bağlantı.",
        price: 2149,
        stock: 24,
        sold: 76,
        categoryId: 1,
        category: "Elektronik",
        images: [
            image(
                3,
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.7,
        reviewCount: 68,
        features: ["Yüzde 75 kompakt düzen", "Bluetooth ve USB-C", "Değiştirilebilir tuş başlıkları"],
        isNew: true,
    },
    {
        id: 4,
        name: "Halo Ayarlanabilir Masa Lambası",
        description:
            "Halo, üç farklı ışık sıcaklığı ve kademesiz parlaklık ayarıyla çalışma masasından okuma köşesine kadar farklı kullanım senaryolarına uyum sağlar.",
        shortDescription: "Üç ışık tonu ve dokunmatik parlaklık kontrolü.",
        price: 1249,
        oldPrice: 1499,
        stock: 30,
        sold: 118,
        categoryId: 2,
        category: "Ev & Yaşam",
        images: [
            image(
                4,
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.7,
        reviewCount: 91,
        badge: "Sepette fırsat",
        features: ["Üç farklı ışık sıcaklığı", "Dokunmatik kontrol", "Ayarlanabilir metal gövde"],
    },
    {
        id: 5,
        name: "Linen Oversize Gömlek",
        description:
            "Nefes alan keten karışımlı dokusu ve rahat kalıbıyla mevsim geçişlerinde tek başına veya katmanlı kombinlerde kullanılmak üzere tasarlandı.",
        shortDescription: "Nefes alan keten karışımı ve rahat kesim.",
        price: 1099,
        stock: 35,
        sold: 64,
        categoryId: 3,
        category: "Giyim",
        images: [
            image(
                5,
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.5,
        reviewCount: 42,
        features: ["Keten karışımlı kumaş", "Rahat oversize kalıp", "Kolay bakım"],
        isNew: true,
    },
    {
        id: 6,
        name: "Coast Çelik Termos 750 ml",
        description:
            "Coast çift katmanlı çelik gövdesiyle içecek sıcaklığını korur; sızdırmaz kapağı ve ince formu sayesinde çantada kolayca taşınır.",
        shortDescription: "Sızdırmaz kapak ve çift katmanlı çelik gövde.",
        price: 749,
        oldPrice: 899,
        stock: 42,
        sold: 181,
        categoryId: 4,
        category: "Outdoor",
        images: [
            image(
                6,
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.9,
        reviewCount: 153,
        badge: "Çok satan",
        features: ["750 ml kapasite", "Sızdırmaz kapak", "BPA içermeyen parçalar"],
    },
    {
        id: 7,
        name: "Cloud Filtre Kahve Makinesi",
        description:
            "Cloud, zaman ayarlı demleme özelliği ve sıcak tutma plakasıyla sabah rutininizi kolaylaştırır. Tek seferde sekiz fincana kadar kahve hazırlar.",
        shortDescription: "Zaman ayarlı demleme ve sekiz fincan kapasitesi.",
        price: 3499,
        oldPrice: 3999,
        stock: 10,
        sold: 53,
        categoryId: 2,
        category: "Ev & Yaşam",
        images: [
            image(
                7,
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.6,
        reviewCount: 57,
        badge: "Haftanın fırsatı",
        features: ["8 fincan kapasitesi", "24 saat zamanlayıcı", "Otomatik sıcak tutma"],
    },
    {
        id: 8,
        name: "Atlas Şehir Sırt Çantası",
        description:
            "Atlas; dolgulu bilgisayar bölmesi, gizli güvenlik cebi ve su itici dış yüzeyiyle işe, okula ve kısa yolculuklara uyum sağlayan günlük bir çantadır.",
        shortDescription: "Dolgulu laptop bölmesi ve su itici dış yüzey.",
        price: 1599,
        stock: 21,
        sold: 88,
        categoryId: 5,
        category: "Aksesuar",
        images: [
            image(
                8,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=88&w=1200",
            ),
        ],
        isActive: true,
        rating: 4.8,
        reviewCount: 74,
        features: ["15 inç laptop bölmesi", "Su itici kumaş", "Gizli arka cep"],
    },
];

export const getProductImage = (product: Pick<CatalogProduct, "images">): string =>
    product.images[0]?.url ??
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=900";
