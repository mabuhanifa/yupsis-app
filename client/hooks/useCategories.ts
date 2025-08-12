import api from "@/lib/api";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
