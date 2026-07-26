import { createContext, useContext } from "react";

export interface FavoritesContextValue {
    favorites: number[];
    toggleFavorite: (productId: number) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const useFavorites = (): FavoritesContextValue => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};
