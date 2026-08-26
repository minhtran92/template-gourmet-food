'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  tenantSlug: string | null;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  setTenant: (slug: string) => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tenantSlug: null,

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find(i => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.productId !== productId) })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items: qty <= 0
            ? state.items.filter(i => i.productId !== productId)
            : state.items.map(i => i.productId === productId ? { ...i, qty } : i),
        })),

      clear: () => set({ items: [] }),
      setTenant: (slug) => set({ tenantSlug: slug }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'g66-cart',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : undefined),
    },
  ),
);
