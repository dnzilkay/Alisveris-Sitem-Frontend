import apiClient from "../apiClient";
import { CatalogProduct, catalogProducts } from "../data/catalog";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

export interface ProductInput {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    images: string[];
    isActive: boolean;
    sold?: number;
}

let mockProducts: CatalogProduct[] = [...catalogProducts];

const delay = <T,>(value: T, milliseconds = 180): Promise<T> =>
    new Promise((resolve) => window.setTimeout(() => resolve(value), milliseconds));

const normalizeProductInput = (
    id: number,
    productData: ProductInput,
    current?: CatalogProduct,
): CatalogProduct => {
    const category = current?.category ?? "Yeni Kategori";
    return {
        id,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        sold: productData.sold ?? current?.sold ?? 0,
        categoryId: productData.categoryId,
        category,
        images: productData.images.map((url, index) => ({
            id: id * 100 + index,
            productId: id,
            url,
        })),
        isActive: productData.isActive,
        description: current?.description ?? `${productData.name} için demo ürün açıklaması.`,
        shortDescription: current?.shortDescription ?? "Yeni eklenen demo katalog ürünü.",
        rating: current?.rating ?? 4.5,
        reviewCount: current?.reviewCount ?? 0,
        features: current?.features ?? ["Demo katalog ürünü"],
        oldPrice: current?.oldPrice,
        badge: current?.badge,
        isNew: current?.isNew,
    };
};
export const fetchProducts = async (): Promise<CatalogProduct[]> => {
    if (useBackend) {
        const response = await apiClient.get<CatalogProduct[]>("/products");
        return response.data;
    }

    return delay(mockProducts.filter((product) => product.isActive));
};

export const createProduct = async (productData: ProductInput): Promise<CatalogProduct> => {
    if (useBackend) {
        const response = await apiClient.post<CatalogProduct>("/products", productData);
        return response.data;
    }

    const nextId = Math.max(0, ...mockProducts.map((product) => product.id)) + 1;
    const newProduct = normalizeProductInput(nextId, productData);
    mockProducts = [...mockProducts, newProduct];
    return delay(newProduct);
};

export const updateProduct = async (
    id: number,
    productData: ProductInput,
): Promise<CatalogProduct> => {
    if (useBackend) {
        const response = await apiClient.put<CatalogProduct>(`/products/${id}`, productData);
        return response.data;
    }

    const current = mockProducts.find((product) => product.id === id);
    if (!current) {
        throw new Error("Ürün bulunamadı.");
    }

    const updatedProduct = normalizeProductInput(id, productData, current);
    mockProducts = mockProducts.map((product) => (product.id === id ? updatedProduct : product));
    return delay(updatedProduct);
};

export const deleteProduct = async (id: number): Promise<{ message: string }> => {
    if (useBackend) {
        await apiClient.delete(`/products/${id}`);
        return { message: "Ürün başarıyla silindi." };
    }

    if (!mockProducts.some((product) => product.id === id)) {
        throw new Error("Ürün bulunamadı.");
    }

    mockProducts = mockProducts.filter((product) => product.id !== id);
    return delay({ message: "Ürün başarıyla silindi." });
};

export const fetchProductById = async (id: number): Promise<CatalogProduct> => {
    if (useBackend) {
        const response = await apiClient.get<CatalogProduct>(`/products/${id}`);
        return response.data;
    }

    const product = mockProducts.find((candidate) => candidate.id === id && candidate.isActive);
    if (!product) {
        throw new Error("Ürün bulunamadı.");
    }

    return delay(product);
};
