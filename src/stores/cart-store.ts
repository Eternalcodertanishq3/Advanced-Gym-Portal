import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id);
    let updated;
    if (existing) {
      updated = state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
    } else {
      updated = [...state.items, item];
    }
    const total = updated.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    return { items: updated, total };
  }),
  removeItem: (id) => set((state) => {
    const updated = state.items.filter(i => i.id !== id);
    const total = updated.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    return { items: updated, total };
  }),
  updateQuantity: (id, quantity) => set((state) => {
    const updated = state.items.map(i => i.id === id ? { ...i, quantity } : i);
    const total = updated.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    return { items: updated, total };
  }),
  clearCart: () => set({ items: [], total: 0 })
}));
