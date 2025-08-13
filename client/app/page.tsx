"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";

export default function Home() {
  const { data, isLoading } = useProducts({
    limit: 12,
    sortBy: "createdAt",
    order: "desc",
  });

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to Yupsis
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Discover our latest collection of products.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-8">Featured Products</h2>

      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  );
}
