import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const importFromSSActiveWear = async () => {
  const { data } = await api.post("/integrations/ssactivewear/import");
  return data;
};

const deployToShopify = async (productId: string) => {
  const { data } = await api.post(
    `/integrations/shopify/products/${productId}/deploy`
  );
  return data;
};

export const useImportFromSSActiveWear = () => {
  return useMutation({ mutationFn: importFromSSActiveWear });
};

export const useDeployToShopify = () => {
  return useMutation({ mutationFn: deployToShopify });
};
