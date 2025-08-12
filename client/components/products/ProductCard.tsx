"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.[0]?.price
    ? `$${parseFloat(product.variants[0].price).toFixed(2)}`
    : "N/A";

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={
              "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500"
            }
            alt={product.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-base font-semibold leading-tight h-10">
          {product.title}
        </CardTitle>
        <p className="text-lg font-bold mt-2">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/products/${product.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
