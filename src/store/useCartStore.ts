import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => { success: boolean; message?: string };
  updateQuantity: (productId: number, quantity: number, stockQuantity: number) => { success: boolean; message?: string };
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product.id === product.id);
        const existingQuantity = existingItem ? existingItem.quantity : 0;
        const newQuantity = existingQuantity + quantity;
        
        if (newQuantity > product.stockQuantity) {
          return { 
            success: false, 
            message: `Cannot add more. Stock limit reached! Only ${product.stockQuantity} items in stock.` 
          };
        }
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, quantity }] });
        }
        
        return { success: true };
      },
      
      updateQuantity: (productId, quantity, stockQuantity) => {
        if (quantity < 1) return { success: false, message: "Quantity must be at least 1" };
        if (quantity > stockQuantity) {
          return { 
            success: false, 
            message: `Only ${stockQuantity} items available in stock.` 
          };
        }
        
        const currentItems = get().items;
        set({
          items: currentItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
        
        return { success: true };
      },
      
      removeItem: (productId) => {
        const currentItems = get().items;
        set({
          items: currentItems.filter((item) => item.product.id !== productId),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'learts-cart-storage', // key in localStorage
    }
  )
);
