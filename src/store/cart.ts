import { create } from "zustand";

export interface AddOnItem {
  addon: any;
  quantity: number;
  eggStyle?: string | null;
}

export interface CartItem {
  product: any;
  quantity: number;
  addons: AddOnItem[];
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  addAddon: (productId: string, addon: any, eggStyle?: string) => void;
  removeAddon: (productId: string, addonId: string) => void;
  updateAddonQty: (productId: string, addonId: string, qty: number) => void;
  total: () => number;
  clear: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],

  // === Add a Donburi item ===
  addItem: (product) => {
    const existing = get().items.find((i) => i.product.id === product.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        items: [...get().items, { product, quantity: 1, addons: [] }],
      });
    }
  },

  // === Remove a Donburi and its addons ===
  removeItem: (productId) =>
    set({
      items: get().items.filter((i) => i.product.id !== productId),
    }),

  // === Set Donburi quantity (auto-remove if 0) ===
  setQty: (productId, qty) =>
    set({
      items: get()
        .items.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        )
        .filter((i) => i.quantity > 0),
    }),

  // === Add an addon under a specific Donburi ===
  addAddon: (productId, addon, eggStyle) =>
    set({
      items: get().items.map((i) =>
        i.product.id === productId
          ? {
              ...i,
              addons: i.addons.find((a) => a.addon.id === addon.id)
                ? i.addons
                : [
                    ...i.addons,
                    {
                      addon,
                      quantity: 1,
                      eggStyle: eggStyle || null,
                    },
                  ],
            }
          : i
      ),
    }),

  // === Remove specific addon from a Donburi ===
  removeAddon: (productId, addonId) =>
    set({
      items: get().items.map((i) =>
        i.product.id === productId
          ? {
              ...i,
              addons: i.addons.filter((a) => a.addon.id !== addonId),
            }
          : i
      ),
    }),

  // === Update addon quantity (auto-remove if qty ≤ 0) ===
  updateAddonQty: (productId, addonId, qty) =>
    set({
      items: get().items.map((i) =>
        i.product.id === productId
          ? {
              ...i,
              addons: i.addons
                .map((a) =>
                  a.addon.id === addonId
                    ? { ...a, quantity: Math.max(qty, 0) }
                    : a
                )
                .filter((a) => a.quantity > 0),
            }
          : i
      ),
    }),

  // === Compute cart total ===
  total: () => {
    let total = 0;
    for (const i of get().items) {
      total += i.product.price_cents * i.quantity;
      for (const a of i.addons) {
        total += a.addon.price_cents * a.quantity;
      }
    }
    return total;
  },

  // === Clear all items ===
  clear: () => set({ items: [] }),
}));
