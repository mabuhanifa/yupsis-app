import api from "@/lib/api";
import { PaginatedResponse, Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async (
  page = 1,
  limit = 12
): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get("/products", {
    params: { page, limit },
  });
  console.log("Fetched products:", data);
  return data;
};

export const useProducts = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["products", { page, limit }],
    queryFn: () => fetchProducts(page, limit),
    keepPreviousData: true,
  });
};
