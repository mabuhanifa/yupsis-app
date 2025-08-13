"use client";

import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export function OrderSummary() {
  const { items, totalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const subtotal = totalPrice();
  const shipping = 5.0; // Example shipping cost
  const total = subtotal + shipping;

  return (
    <div className="p-6 bg-muted/50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="rounded-md object-cover"
              />
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
            </div>
            <p className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Shipping</p>
          <p>${shipping.toFixed(2)}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-semibold text-lg">
        <p>Total</p>
        <p>${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
