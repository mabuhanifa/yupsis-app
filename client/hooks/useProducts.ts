import api from "@/lib/api";
import { PaginatedResponse, Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
};

interface UpdateProductPayload {
  id: string;
  title?: string;
  vendor?: string;
  description?: string;
  image?: string;
}

const updateProduct = async (
  payload: UpdateProductPayload
): Promise<Product> => {
  const { id, ...updateData } = payload;
  const { data } = await api.patch(`/products/${id}`, updateData);
  return data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
    },
  });
};
