import apiClient from '../apiClient';

// Tüm kullanıcıları listele
export const getUsers = async () => {
    const response = await apiClient.get('/users');
    return response.data; // Sadece veriyi döndür
};

// Yeni kullanıcı ekle
export const addUser = async (user: { username: string; email: string; role: string;  }) => {
    const response = await apiClient.post('/users/register', user);
    return response.data; // Sadece veriyi döndür
};

// Kullanıcıyı güncelle
export const updateUser = async (id: number, user: { username: string; email: string; role: string; }) => {
    const response = await apiClient.put(`/users/${id}`, user);
    return response.data; // Sadece veriyi döndür
};

// Kullanıcıyı sil
export const deleteUser = async (id: number) => {
    return apiClient.delete(`/users/${id}`);
};
