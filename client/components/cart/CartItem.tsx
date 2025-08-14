"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCartStore,
  type CartItem as CartItemType,
} from "@/stores/cartStore";
import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
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
        <p className="font-medium text-sm leading-tight">{item.title}</p>
        <p className="text-xs text-muted-foreground">
          ${item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="h-8 w-16 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
