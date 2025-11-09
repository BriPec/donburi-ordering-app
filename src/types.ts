export interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  is_active: boolean;
  image_url?: string;
}

export type AddOn = {
  id: string;
  name: string;
  price_cents: number;
  type: "Egg" | "Cheese" | "Rice";
  egg_style?: "Soft-Boiled" | "Poached" | "Sunny Side Up" | "Raw" | null;
};
export type CartAddOn = { addon: AddOn; quantity: number };
export type CartItem = {
  product: Product;
  quantity: number;
  addons: CartAddOn[];
};
export type OrderPayload = {
  customer_name: string;
  contact_number: string;
  delivery_address: string;
  notes?: string;
  payment_method: "BDO" | "BPI" | "MAYA" | "GCASH";
  proof_url?: string | null;
  items: {
    product_id: string;
    quantity: number;
    addons: { addon_id: string; quantity: number }[];
  }[];
};
