import api from "@/lib/api";
import { useCartStore } from "@/stores/cartStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface OrderPayload {
  email: string;
  items: {
    id: string;
    quantity: number;
  }[];
}

const createOrder = async (orderData: OrderPayload) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

export const useCreateOrder = () => {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    },
  });
};
