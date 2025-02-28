import apiClient from "../apiClient";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// Mock Kategori Verisi
let mockCategories = [
    { id: 1, name: "Elektronik", description: "Telefon, kulaklık, saat gibi ürünler", isActive: true },
    { id: 2, name: "Giyim", description: "Tişörtler, pantolonlar ve daha fazlası", isActive: true },
    { id: 3, name: "Ev & Yaşam", description: "Mobilya, dekorasyon ve ev eşyaları", isActive: true },
];

// Tüm Kategorileri Getir
export const fetchCategories = async () => {
    if (useBackend) {
        try {
            const response = await apiClient.get("/categories");
            return response.data;
        } catch (error) {
            console.error("Kategoriler alınırken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve) => setTimeout(() => resolve(mockCategories), 500));
    }
};

// Tek bir kategori ve ürünlerini getir
export const fetchCategoryById = async (id: number) => {
    if (useBackend) {
        try {
            const response = await apiClient.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Kategori (${id}) alınırken hata oluştu:`, error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const category = mockCategories.find((c) => c.id === id);
                if (category) {
                    resolve(category);
                } else {
                    reject("Kategori bulunamadı!");
                }
            }, 500);
        });
    }
};

// Yeni Kategori Oluştur
export const createCategory = async (categoryData: { name: string; description: string; isActive: boolean }) => {
    if (useBackend) {
        try {
            const response = await apiClient.post("/categories", categoryData);
            return response.data;
        } catch (error) {
            console.error("Kategori oluşturulurken hata oluştu:", error);
            throw error;
        }
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCategory = { id: mockCategories.length + 1, ...categoryData };
                mockCategories.push(newCategory);
                resolve(newCategory);
            }, 500);
        });
    }
};

// Kategoriyi Güncelle
export const updateCategory = async (id: number, categoryData: { name: string; description: string; isActive: boolean }) => {
    if (useBackend) {
        try {
            const response = await apiClient.put(`/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error(`Kategori (${id}) güncellenirken hata oluştu:`, error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCategories.findIndex((c) => c.id === id);
                if (index !== -1) {
                    mockCategories[index] = { ...mockCategories[index], ...categoryData };
                    resolve(mockCategories[index]);
                } else {
                    reject("Kategori bulunamadı!");
                }
            }, 500);
        });
    }
};

// Kategoriyi Sil
export const deleteCategory = async (id: number) => {
    if (useBackend) {
        try {
            await apiClient.delete(`/categories/${id}`);
            console.log(`Kategori (${id}) başarıyla silindi.`);
        } catch (error) {
            console.error(`Kategori (${id}) silinirken hata oluştu:`, error);
            throw error;
        }
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockCategories.findIndex((c) => c.id === id);
                if (index !== -1) {
                    mockCategories.splice(index, 1);
                    resolve({ message: "Kategori başarıyla silindi" });
                } else {
                    reject("Kategori bulunamadı!");
                }
            }, 500);
        });
    }
};
