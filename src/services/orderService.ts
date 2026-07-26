import apiClient from "../apiClient";
import { CatalogProduct } from "../data/catalog";
import { fetchProducts } from "./productService";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

export interface OrderItem {
    productId: number;
    quantity: number;
    product?: CatalogProduct | null;
    Product?: CatalogProduct | null;
}

export interface StoreOrder {
    id: number;
    userId: number;
    status: string;
    total: number;
    items: OrderItem[];
    User?: { username: string };
}

const mockOrders: StoreOrder[] = [
    {
        id: 1,
        userId: 1,
        status: "Hazırlanıyor",
        total: 9598,
        items: [{ productId: 1, quantity: 2 }],
        User: { username: "Admin" },
    },
    {
        id: 2,
        userId: 1,
        status: "Kargoya Verildi",
        total: 2899,
        items: [{ productId: 2, quantity: 1 }],
        User: { username: "Admin" },
    },
    {
        id: 3,
        userId: 2,
        status: "Teslim Edildi",
        total: 2247,
        items: [{ productId: 6, quantity: 3 }],
        User: { username: "User" },
    },
];

const mergeProducts = (orders: StoreOrder[], products: CatalogProduct[]): StoreOrder[] =>
    orders.map((order) => ({
        ...order,
        items: order.items.map((item) => {
            const product = products.find((candidate) => candidate.id === item.productId) ?? null;
            return { ...item, product, Product: product };
        }),
    }));

export const getOrders = async (): Promise<StoreOrder[]> => {
    if (useBackend) {
        const [ordersResponse, products] = await Promise.all([
            apiClient.get<StoreOrder[]>("/orders"),
            fetchProducts(),
        ]);
        return mergeProducts(ordersResponse.data, products);
    }

    const products = await fetchProducts();
    return new Promise((resolve) =>
        window.setTimeout(() => resolve(mergeProducts(mockOrders, products)), 180),
    );
};
export const updateOrderStatus = async (id: number, status: string): Promise<StoreOrder> => {
    if (useBackend) {
        const response = await apiClient.put<StoreOrder>(`/orders/${id}`, { status });
        return response.data;
    }

    const order = mockOrders.find((candidate) => candidate.id === id);
    if (!order) {
        throw new Error("Sipariş bulunamadı.");
    }
    order.status = status;
    return new Promise((resolve) => window.setTimeout(() => resolve({ ...order }), 140));
};

export const addOrder = async (order: Omit<StoreOrder, "id" | "status">): Promise<StoreOrder> => {
    if (useBackend) {
        const response = await apiClient.post<StoreOrder>("/orders", order);
        return response.data;
    }

    const newOrder: StoreOrder = {
        id: Math.max(0, ...mockOrders.map((item) => item.id)) + 1,
        ...order,
        status: "Hazırlanıyor",
    };
    mockOrders.push(newOrder);
    return new Promise((resolve) => window.setTimeout(() => resolve(newOrder), 140));
};
