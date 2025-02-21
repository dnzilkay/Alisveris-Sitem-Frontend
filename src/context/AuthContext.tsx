import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Kullanıcı tipi tanımları
interface User {
    id: number; // Kullanıcı ID'si
    token: string;
    role: string;
    username: string; // Kullanıcı adı
    email: string; // E-posta adresi
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, role: string, username: string,email:string) => void; // id çıkarıldı, token ile çalışılacak
    logout: () => void;
}

// Context oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT Çözümleme Fonksiyonu
const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT çözümleme hatası:', error);
        return null;
    }
};

// AuthProvider bileşeni
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Giriş işlemi
    const login = (token: string, role: string, username: string, email:string) => {
        const decodedToken = parseJwt(token);
        const id = decodedToken?.id;

        if (!id) {
            console.error('JWT içinden kullanıcı ID alınamadı.');
            return;
        }

        setUser({ id, token, role, username ,email});
        localStorage.setItem('userId', id.toString());
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
    };

    // Çıkış işlemi
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email'); // E-posta da silinecek
    };

    // Kullanıcı doğrulama
    const isAuthenticated = !!user;

    useEffect(() => {
        const id = Number(localStorage.getItem('userId'));
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');

        if (id && token && role && username && email) {
            setUser({ id, token, role, username ,email});
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext Hooku
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
