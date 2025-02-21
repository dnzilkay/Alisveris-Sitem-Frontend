import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    id: number;
    name: string;
    price: string | number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    removeItem: (id: number) => void;
    addToCart: (item: CartItem) => void;
    clearCart: () => void;
    completeOrder: () => void;  // Siparişi Tamamlama Fonksiyonu
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const increaseQuantity = (id: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            // `price`'ı string yerine number olarak ekleyin
            const price = typeof item.price === "string" ? parseFloat(item.price.replace(" TL", "").replace(",", "")) : item.price;
            return [...prevCart, { ...item, price }];
        });
    };

    // Sepeti tamamen boşaltma fonksiyonu
    const clearCart = () => {
        setCart([]);
    };

    // Siparişi tamamla ve satış miktarını artır
    const completeOrder = () => {
        cart.forEach((item) => {
            const currentSalesCount = parseInt(localStorage.getItem(`product-${item.id}-sales`) || "0");
            const updatedSalesCount = currentSalesCount + item.quantity;

            // Satış miktarını localStorage'a kaydet
            localStorage.setItem(`product-${item.id}-sales`, String(updatedSalesCount));
        });

        // Siparişi temizle
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, increaseQuantity, decreaseQuantity, removeItem, addToCart, clearCart, completeOrder }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
