"use client";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/products");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <CheckoutForm />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
