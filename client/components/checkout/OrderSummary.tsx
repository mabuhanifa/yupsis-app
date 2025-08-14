"use client";

import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import { ImageIcon } from "lucide-react";
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
  const tax = subtotal * 0.1; // Example tax
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-medium text-sm">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <Separator className="my-6" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Shipping</p>
          <p>${shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Tax</p>
          <p>${tax.toFixed(2)}</p>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex justify-between font-bold text-lg">
        <p>Total</p>
        <p>${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
