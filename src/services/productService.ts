import apiClient from "../apiClient";

// Ürünleri Listele
export const fetchProducts = async () => {
    try {
        const response = await apiClient.get('/products');
        return response.data;
    } catch (error) {
        console.error("Ürünler alınırken hata oluştu:", error);
        throw error;
    }
};

// Yeni Ürün Oluştur
export const createProduct = async (productData: { name: string; price: number; stock: number; categoryId: number; images: string[]; isActive: boolean }) => {
    try {
        const response = await apiClient.post('/products', productData);
        return response.data;
    } catch (error) {
        console.error("Ürün oluşturulurken hata oluştu:", error);
        throw error;
    }
};

// Ürün Güncelle
export const updateProduct = async (id: number, productData: { name: string; price: number; stock: number; categoryId: number; images: string[]; isActive: boolean }) => {
    try {
        const response = await apiClient.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Ürün güncellenirken hata oluştu:", error);
        throw error;
    }
};

// Ürün Sil
export const deleteProduct = async (id: number) => {
    try {
        await apiClient.delete(`/products/${id}`);
    } catch (error) {
        console.error("Ürün silinirken hata oluştu:", error);
        throw error;
    }
};

export const fetchProductById = async (id: number) => {
    try {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Ürün detayları alınırken hata oluştu:", error);
        throw error;
    }
};
