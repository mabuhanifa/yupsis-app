import api from "@/lib/api";
import { ProductDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";

const fetchProduct = async (id: string): Promise<ProductDetail> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id, // Only run query if id is available
  });
};
