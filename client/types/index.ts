export interface Variant {
  id: string;
  productId: string;
  title: string;
  sku: string;
  price: string;
  cost?: string;
  grams?: number;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  image?: string;
  vendor?: string;
  variants: Pick<Variant, "price">[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
