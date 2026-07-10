import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryName: string;
}

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...currentItems, product] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'learts-wishlist',
    }
  )
);
