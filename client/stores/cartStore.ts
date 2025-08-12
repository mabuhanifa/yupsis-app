import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // Variant ID
  title: string; // Product title
  price: number; // Product price
  image?: string; // Product image URL
  quantity: number; // Quantity of the product in the cart
}

interface CartState {
  items: CartItem[]; // Array of items in the cart
  addItem: (item: CartItem) => void; // Function to add an item to the cart
  removeItem: (itemId: string) => void; // Function to remove an item from the cart
  updateQuantity: (itemId: string, quantity: number) => void; // Function to update the quantity of an item in the cart
  clearCart: () => void; // Function to clear the cart
  totalItems: () => number; // Function to get the total number of items in the cart
  totalPrice: () => number; // Function to get the total price of items in the cart
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item }] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === itemId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
