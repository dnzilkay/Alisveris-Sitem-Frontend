import apiClient from "../apiClient";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// **Mock Ürün Verisi**
// **Mock Ürün Verisi (Gerçek Resim URL'leriyle)**
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

// **Ürünleri Listele**
export const fetchProducts = async () => {
    if (useBackend) {
        try {
            const response = await apiClient.get('/products');
            return response.data;
        } catch (error) {
            console.error("Ürünler alınırken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve) => setTimeout(() => resolve(mockProducts), 500));
    }
};

// **Yeni Ürün Oluştur**
export const createProduct = async (productData: { name: string; price: number; stock: number; categoryId: number; images: string[]; isActive: boolean }) => {
    if (useBackend) {
        try {
            const response = await apiClient.post('/products', productData);
            return response.data;
        } catch (error) {
            console.error("Ürün oluşturulurken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProduct = { id: mockProducts.length + 1, ...productData };
                mockProducts.push(newProduct);
                resolve(newProduct);
            }, 500);
        });
    }
};

// **Ürün Güncelle**
export const updateProduct = async (id: number, productData: { name: string; price: number; stock: number; categoryId: number; images: string[]; isActive: boolean }) => {
    if (useBackend) {
        try {
            const response = await apiClient.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error("Ürün güncellenirken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockProducts.findIndex((p) => p.id === id);
                if (index !== -1) {
                    mockProducts[index] = { ...mockProducts[index], ...productData };
                    resolve(mockProducts[index]);
                } else {
                    reject(new Error("Ürün bulunamadı!"));
                }
            }, 500);
        });
    }
};

// **Ürün Sil**
export const deleteProduct = async (id: number) => {
    if (useBackend) {
        try {
            await apiClient.delete(`/products/${id}`);
        } catch (error) {
            console.error("Ürün silinirken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockProducts.findIndex((p) => p.id === id);
                if (index !== -1) {
                    mockProducts.splice(index, 1);
                    resolve({ message: "Ürün başarıyla silindi" });
                } else {
                    reject(new Error("Ürün bulunamadı!"));
                }
            }, 500);
        });
    }
};

// **Tekil Ürün Getir**
export const fetchProductById = async (id: number) => {
    if (useBackend) {
        try {
            const response = await apiClient.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error("Ürün detayları alınırken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = mockProducts.find((p) => p.id === id);
                if (product) {
                    resolve(product);
                } else {
                    reject(new Error("Ürün bulunamadı!"));
                }
            }, 500);
        });
    }
};
