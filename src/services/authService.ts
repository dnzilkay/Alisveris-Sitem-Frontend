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
            return new Promise(async (resolve, reject) => {
                const users = await getUsers();
                const userExists = users.some((u: { email: string }) => u.email === data.email);


                if (userExists) {
                    reject(new Error("Bu e-posta adresi zaten kullanılıyor."));
                    return;
                }

                setTimeout(async () => {
                    const newUser = await addUser({ ...data, role: "user" });
                    resolve({ message: "Kayıt başarılı!", user: newUser });
                }, 500);
            });
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
            return new Promise(async (resolve, reject) => {
                const users = await getUsers();
                setTimeout(() => {
                    const user = users.find((u: { email: string; password: string }) =>
                        u.email === data.email && u.password === data.password
                    );
                    if (user) {
                        const mockToken = generateFakeJWT(user.id, user.username, user.email, user.role);
                        localStorage.setItem("authToken", mockToken);
                        resolve({ token: mockToken, user: { id: user.id, username: user.username, role: user.role } });
                    } else {
                        reject(new Error("Kullanıcı adı veya şifre hatalı!"));
                    }
                }, 500);
            });
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
