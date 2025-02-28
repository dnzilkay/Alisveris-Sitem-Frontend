import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loginUser, logoutUser } from '../services/authService';

interface User {
    id: number;
    token: string;
    role: string;
    username: string;
    email: string;
    exp: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // **Giriş İşlemi**
    const login = async (email: string, password: string) => {
        try {
            const response = await loginUser({ email, password });
            if (!response.token) {
                throw new Error("Geçersiz yanıt: Token alınamadı.");
            }
            const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
            setUser(tokenPayload);
            localStorage.setItem('authToken', response.token);
        } catch (error) {
            console.error("Giriş hatası:", error);
        }
    };

    // **Çıkış İşlemi**
    const logout = () => {
        logoutUser();
        setUser(null);
    };

    // **Kullanıcı Oturumunu Yükleme**
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            if (tokenPayload.exp > Math.floor(Date.now() / 1000)) {
                setUser(tokenPayload);
            } else {
                logout();
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// **AuthContext Hook'u**
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
