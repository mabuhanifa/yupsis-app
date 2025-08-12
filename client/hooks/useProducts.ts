import api from "@/lib/api";
import { PaginatedResponse, Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: string;
  category?: string;
}

const fetchProducts = async (
  filters: ProductFilters
): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get("/products", {
    params: filters,
  });
  return data;
};

export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true,
  });
};
