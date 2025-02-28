import apiClient from "../apiClient";
import { fetchProducts } from "./productService";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// **Mock Ürün Verisi** (Sadece mock modda kullanacağız)
const mockProducts = [
    {
        id: 1,
        name: "Kablosuz Kulaklık",
        price: 499.99,
        images: ["https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=2913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"], // Gerçek Resim URL'si
        stock: 15,
        categoryId: 1,
        isActive: true
    },
    {
        id: 2,
        name: "Akıllı Saat",
        price: 899.99,
        images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D"], // Gerçek Resim URL'si
        stock: 8,
        categoryId: 2,
        isActive: true
    },
    {
        id: 3,
        name: "Oyuncu Mouse",
        price: 299.99,
        images: ["https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtaW5nJTIwbW91c2V8ZW58MHx8MHx8fDA%3D"], // Gerçek Resim URL'si
        stock: 20,
        categoryId: 3,
        isActive: true
    },
];


// **Mock Sipariş Verisi** (Sadece mock modda kullanacağız)
let mockOrders = [
    {
        id: 1,
        userId: 1,
        status: "Hazırlanıyor",
        total: 999.99,
        items: [
            { productId: 1, quantity: 2 },
        ],
    },
    {
        id: 2,
        userId: 1,
        status: "Kargoya Verildi",
        total: 299.99,
        items: [
            { productId: 2, quantity: 1 },
        ],
    },
    {
        id: 3,
        userId: 2,
        status: "Teslim Edildi",
        total: 1500.50,
        items: [
            { productId: 3, quantity: 3 },
        ],
    },
];

// **Tüm Siparişleri Getir (Ürünlerle Birleştirilmiş Hali)**
export const getOrders = async () => {
    if (useBackend) {
        try {
            // 1) Hem siparişleri hem de ürünleri paralel olarak çekiyoruz
            const [ordersResponse, productList] = await Promise.all([
                apiClient.get("/orders"),   // backend'den sipariş listesi
                fetchProducts()            // productService'ten ürün listesi
            ]);

            const orders = ordersResponse.data; // gelen sipariş verisi
            // 2) Her siparişin items'ındaki productId ile productList'i eşleştiriyoruz
            const updatedOrders = orders.map((order: any) => {
                order.items = order.items.map((item: any) => {
                    const product = productList.find((p: any) => p.id === item.productId);
                    return {
                        ...item,
                        product: product || null, // eşleşen ürünü ekle, yoksa null
                    };
                });
                return order;
            });

            return updatedOrders;
        } catch (error) {
            console.error("Siparişler alınırken hata oluştu:", error);
            throw error;
        }
    } else {
        // MOCK MOD
        return new Promise((resolve) => {
            setTimeout(() => {
                // 1) Mock ürünleri alıyoruz (mockProducts)
                // 2) Her siparişin items'ındaki productId ile mockProducts'ı eşleştiriyoruz
                const updatedOrders = mockOrders.map((order) => {
                    const mergedItems = order.items.map((item) => {
                        const product = mockProducts.find((p) => p.id === item.productId);
                        return {
                            ...item,
                            product: product || null,
                        };
                    });
                    return { ...order, items: mergedItems };
                });

                resolve(updatedOrders);
            }, 500);
        });
    }
};

// **Sipariş Durumu Güncelle (değişmedi, aynı)**
export const updateOrderStatus = async (id: number, status: string) => {
    if (useBackend) {
        try {
            const response = await apiClient.put(`/orders/${id}`, { status });
            return response.data;
        } catch (error) {
            console.error("Sipariş durumu güncellenirken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const orderIndex = mockOrders.findIndex((o) => o.id === id);
                if (orderIndex !== -1) {
                    mockOrders[orderIndex] = { ...mockOrders[orderIndex], status };
                    resolve(mockOrders[orderIndex]);
                } else {
                    reject(new Error("Sipariş bulunamadı!"));
                }
            }, 500);
        });
    }
};

// **Yeni Sipariş Ekle (değişmedi, aynı)**
export const addOrder = async (order: { userId: number; total: number; items: { productId: number; quantity: number }[] }) => {
    if (useBackend) {
        try {
            const response = await apiClient.post("/orders", order);
            return response.data;
        } catch (error) {
            console.error("Sipariş oluşturulurken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newOrder = {
                    id: mockOrders.length + 1,
                    ...order,
                    status: "Hazırlanıyor",
                };
                mockOrders.push(newOrder);
                resolve(newOrder);
            }, 500);
        });
    }
};
