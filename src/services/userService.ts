import apiClient from '../apiClient';

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// **Mock Kullanıcı Listesi (Şifreler Dahil)**
export interface StoreUser {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}

const mockUsers: StoreUser[] = [
    { id: 1, username: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
    { id: 2, username: "User", email: "user@example.com", password: "user123", role: "user" },
];

// **Tüm Kullanıcıları Listele**
export const getUsers = async (): Promise<StoreUser[]> => {
    if (useBackend) {
        const response = await apiClient.get<StoreUser[]>('/users');
        return response.data;
    } else {
        return new Promise((resolve) => setTimeout(() => resolve(mockUsers), 500));
    }
};

// **Yeni Kullanıcı Ekle**
export const addUser = async (user: Omit<StoreUser, "id">): Promise<StoreUser> => {
    if (useBackend) {
        const response = await apiClient.post<StoreUser>('/users/register', user);
        return response.data;
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { id: mockUsers.length + 1, ...user };
                mockUsers.push(newUser);
                resolve(newUser);
            }, 500);
        });
    }
};

// **Kullanıcı Güncelle**
export const updateUser = async (id: number, user: Partial<Omit<StoreUser, "id">>): Promise<StoreUser> => {
    if (useBackend) {
        const response = await apiClient.put<StoreUser>(`/users/${id}`, user);
        return response.data;
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockUsers.findIndex(u => u.id === id);
                if (index !== -1) {
                    mockUsers[index] = { ...mockUsers[index], ...user };
                    resolve(mockUsers[index]);
                } else {
                    throw new Error("Kullanıcı bulunamadı.");
                }
            }, 500);
        });
    }
};

// **Kullanıcı Sil**
export const deleteUser = async (id: number) => {
    if (useBackend) {
        return apiClient.delete(`/users/${id}`);
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockUsers.findIndex(u => u.id === id);
                if (index !== -1) {
                    mockUsers.splice(index, 1);
                    resolve(true);
                }
            }, 500);
        });
    }
};
