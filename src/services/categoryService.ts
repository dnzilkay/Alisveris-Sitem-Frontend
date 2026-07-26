import apiClient from "../apiClient";
import { CatalogCategory, catalogCategories, catalogProducts } from "../data/catalog";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

export interface CategoryInput {
    name: string;
    description: string;
    isActive: boolean;
}

export interface CategoryWithProducts extends CatalogCategory {
    products: typeof catalogProducts;
}

let mockCategories: CatalogCategory[] = [...catalogCategories];

const delay = <T,>(value: T, milliseconds = 140): Promise<T> =>
    new Promise((resolve) => window.setTimeout(() => resolve(value), milliseconds));

const withProducts = (category: CatalogCategory): CategoryWithProducts => ({
    ...category,
    products: catalogProducts.filter((product) => product.categoryId === category.id),
});

export const fetchCategories = async (): Promise<CategoryWithProducts[]> => {
    if (useBackend) {
        const response = await apiClient.get<CategoryWithProducts[]>("/categories");
        return response.data;
    }

    return delay(mockCategories.filter((category) => category.isActive).map(withProducts));
};

export const fetchCategoryById = async (id: number): Promise<CategoryWithProducts> => {
    if (useBackend) {
        const response = await apiClient.get<CategoryWithProducts>(`/categories/${id}`);
        return response.data;
    }

    const category = mockCategories.find((candidate) => candidate.id === id);
    if (!category) {
        throw new Error("Kategori bulunamadı.");
    }

    return delay(withProducts(category));
};

export const createCategory = async (categoryData: CategoryInput): Promise<CategoryWithProducts> => {
    if (useBackend) {
        const response = await apiClient.post<CategoryWithProducts>("/categories", categoryData);
        return response.data;
    }

    const nextId = Math.max(0, ...mockCategories.map((category) => category.id)) + 1;
    const category: CatalogCategory = {
        id: nextId,
        image: catalogCategories[0].image,
        ...categoryData,
    };
    mockCategories = [...mockCategories, category];
    return delay(withProducts(category));
};

export const updateCategory = async (
    id: number,
    categoryData: CategoryInput,
): Promise<CategoryWithProducts> => {
    if (useBackend) {
        const response = await apiClient.put<CategoryWithProducts>(`/categories/${id}`, categoryData);
        return response.data;
    }

    const current = mockCategories.find((category) => category.id === id);
    if (!current) {
        throw new Error("Kategori bulunamadı.");
    }

    const updatedCategory = { ...current, ...categoryData };
    mockCategories = mockCategories.map((category) =>
        category.id === id ? updatedCategory : category,
    );
    return delay(withProducts(updatedCategory));
};

export const deleteCategory = async (id: number): Promise<{ message: string }> => {
    if (useBackend) {
        await apiClient.delete(`/categories/${id}`);
        return { message: "Kategori başarıyla silindi." };
    }

    if (!mockCategories.some((category) => category.id === id)) {
        throw new Error("Kategori bulunamadı.");
    }

    mockCategories = mockCategories.filter((category) => category.id !== id);
    return delay({ message: "Kategori başarıyla silindi." });
};
