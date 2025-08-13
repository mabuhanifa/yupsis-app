"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const firstVariant = product.variants?.[0];

  const price = firstVariant?.price
    ? `$${parseFloat(firstVariant.price).toFixed(2)}`
    : "N/A";

  const handleAddToCart = () => {
    if (firstVariant && product.id) {
      addItem({
        id: product.id,
        title: product.title,
        price: parseFloat(firstVariant.price),
        image: product.images?.[0]?.src,
        quantity: 1,
      });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Could not add to cart",
        description:
          "This product is currently unavailable or missing details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={
              product.images?.[0]?.src ||
              "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500"
            }
            alt={product.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 flex flex-col">
        <div>
          <CardTitle className="text-base font-semibold leading-tight h-10 line-clamp-2">
            {product.title}
          </CardTitle>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex-grow" />
        <p className="text-lg font-bold">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/products/${product.id}`} passHref className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!firstVariant}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
