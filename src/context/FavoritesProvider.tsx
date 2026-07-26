import React, { ReactNode, useState } from "react";
import { FavoritesContext } from "./favoritesContext";

const STORAGE_KEY = "nova-favorite-products";

const getStoredFavorites = (): number[] => {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? JSON.parse(value) as number[] : [];
    } catch {
        return [];
    }
};

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<number[]>(getStoredFavorites);

    const toggleFavorite = (productId: number) => {
        setFavorites((current) => {
            const next = current.includes(productId)
                ? current.filter((favoriteId) => favoriteId !== productId)
                : [...current, productId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
