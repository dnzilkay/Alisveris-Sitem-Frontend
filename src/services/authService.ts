import apiClient from '../apiClient';
import { getUsers, addUser } from './userService';

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// **Mock JWT Üretme Fonksiyonu**
const generateFakeJWT = (id: number, username: string, email: string, role: string) => {
    const fakePayload = {
        id,
        username,
        email,
        role,
        exp: Math.floor(Date.now() / 1000) + 7200, // 2 saatlik token süresi
    };
    return `fakeHeader.${btoa(JSON.stringify(fakePayload))}.fakeSignature`;
};

// **Kullanıcı Kayıt (Register)**
export const registerUser = async (data: { username: string; email: string; password: string }) => {
    try {
        if (useBackend) {
            const response = await apiClient.post('/users/register', data);
            return response.data;
        } else {
            const users = await getUsers();
            const userExists = users.some((user) => user.email === data.email);
            if (userExists) {
                throw new Error("Bu e-posta adresi zaten kullanılıyor.");
            }
            await new Promise((resolve) => window.setTimeout(resolve, 300));
            const newUser = await addUser({ ...data, role: "user" });
            return { message: "Kayıt başarılı!", user: newUser };
        }
    } catch (error) {
        console.error("Kayıt hatası:", error);
        throw new Error("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
};

// **Kullanıcı Giriş (Login)**
export const loginUser = async (data: { email: string; password: string }) => {
    try {
        if (useBackend) {
            const response = await apiClient.post('/users/login', data);

            console.log(response);
            if (!response.data.token) {
                throw new Error("Sunucudan geçerli bir token alınamadı.");
            }

            localStorage.setItem("authToken", response.data.token);
            return response.data;
        } else {
            const users = await getUsers();
            await new Promise((resolve) => window.setTimeout(resolve, 300));
            const user = users.find(
                (candidate) => candidate.email === data.email && candidate.password === data.password,
            );
            if (!user) {
                throw new Error("Kullanıcı adı veya şifre hatalı!");
            }
            const mockToken = generateFakeJWT(user.id, user.username, user.email, user.role);
            localStorage.setItem("authToken", mockToken);
            return { token: mockToken, user: { id: user.id, username: user.username, role: user.role } };
        }
    } catch (error) {
        console.error("Giriş hatası:", error);
        throw new Error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
};

// **Kullanıcı Çıkış (Logout)**
export const logoutUser = () => {
    localStorage.removeItem('authToken');
};
