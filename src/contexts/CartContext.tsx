
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  item: FoodItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: FoodItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        toast({
          title: "Item adicionado!",
          description: `${item.name} (${existingItem.quantity + 1})`,
        });
        
        return currentCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      toast({
        title: "Item adicionado!",
        description: item.name,
      });
      
      return [...currentCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(currentCart => {
      const itemToRemove = currentCart.find(cartItem => cartItem.item.id === itemId);
      
      if (itemToRemove) {
        toast({
          title: "Item removido",
          description: itemToRemove.item.name,
          variant: "destructive",
        });
      }
      
      return currentCart.filter(cartItem => cartItem.item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(currentCart =>
      currentCart.map(cartItem =>
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity } 
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos",
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => 
      total + (cartItem.item.price * cartItem.quantity), 0
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, cartItem) => count + cartItem.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
