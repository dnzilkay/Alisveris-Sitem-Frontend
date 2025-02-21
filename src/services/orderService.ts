import apiClient from "../apiClient";

// Tüm siparişleri getir
export const getOrders = async () => {
    const response = await apiClient.get("/orders");
    return response.data;
};

// Sipariş durumu güncelle
export const updateOrderStatus = async (id: number, status: string) => {
    const response = await apiClient.put(`/orders/${id}`, { status });
    return response.data;
};

// Yeni sipariş ekle
export const addOrder = async (order: any) => {
    const response = await apiClient.post("/orders", order);
    return response.data;
};
