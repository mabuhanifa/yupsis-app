import { CheckoutFormValues } from "@/lib/validators";
import { CartItem } from "@/stores/cartStore";

export interface Inventory {
  id: string;
  variantId: string;
  quantity: number;
  location?: string;
}

export interface Variant {
  id: string;
  productId: string;
  title: string;
  sku: string;
  price: string;
  cost?: string;
  grams?: number;
  inventory?: Inventory;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  image?: string;
  vendor?: string;
  variants: Pick<Variant, "price">[];
}

export interface ProductDetail extends Omit<Product, "variants"> {
  variants: Variant[];
}

export interface CreateOrderPayload {
  customerInfo: CheckoutFormValues;
  items: CartItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
