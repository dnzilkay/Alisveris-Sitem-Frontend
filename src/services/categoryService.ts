import apiClient from "../apiClient";

// Tüm kategorileri getir
export const fetchCategories = async () => {
    try {
        const response = await apiClient.get("/categories");
        return response.data; // Gelen tüm kategorileri döndür
    } catch (error) {
        console.error("Kategoriler alınırken hata oluştu:", error);
        throw error;
    }
};

// Tek bir kategori ve ürünlerini getir
export const fetchCategoryById = async (id: number) => {
    try {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data; // Gelen kategori detayını ve ürünlerini döndür
    } catch (error) {
        console.error(`Kategori (${id}) alınırken hata oluştu:`, error);
        throw error;
    }
};

// Yeni kategori oluştur
export const createCategory = async (categoryData: {
    name: string;
    description: string;
    isActive: boolean;
}) => {
    try {
        const response = await apiClient.post("/categories", categoryData);
        return response.data; // Oluşturulan kategori bilgisi döndür
    } catch (error) {
        console.error("Kategori oluşturulurken hata oluştu:", error);
        throw error;
    }
};

// Kategoriyi güncelle
export const updateCategory = async (
    id: number,
    categoryData: { name: string; description: string; isActive: boolean }
) => {
    try {
        const response = await apiClient.put(`/categories/${id}`, categoryData);
        return response.data; // Güncellenmiş kategori bilgisi döndür
    } catch (error) {
        console.error(`Kategori (${id}) güncellenirken hata oluştu:`, error);
        throw error;
    }
};

// Kategoriyi sil
export const deleteCategory = async (id: number) => {
    try {
        await apiClient.delete(`/categories/${id}`);
        console.log(`Kategori (${id}) başarıyla silindi.`);
    } catch (error) {
        console.error(`Kategori (${id}) silinirken hata oluştu:`, error);
        throw error;
    }
};
