import apiClient from '../apiClient';

// Kullanıcı Kayıt
export const registerUser = async (data: { username: string; email: string; password: string }) => {
    return apiClient.post('/users/register', data);
};

// Kullanıcı Giriş
export const loginUser = async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/users/login', data);
    return response.data; // Backend'den dönen JWT token veya kullanıcı bilgileri
};

// Kullanıcı Çıkış
export const logoutUser = () => {
    localStorage.removeItem('token'); // Token'ı localStorage'dan kaldır
};


