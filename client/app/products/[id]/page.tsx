"use client";

import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const { data: product, isLoading, isError, error } = useProduct(id);

  const addItemToCart = useCartStore((state) => state.addItem);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return <div className="text-center py-10">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const firstVariant = product.variants?.[0];

  const handleAddToCart = () => {
    if (firstVariant) {
      addItemToCart({
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
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
    }
  };

  const displayPrice = firstVariant
    ? `$${parseFloat(firstVariant.price).toFixed(2)}`
    : "N/A";

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full">
          <Image
            src={
              product.images?.[0]?.src ||
              "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500"
            }
            alt={product.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold">{displayPrice}</p>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              disabled={!firstVariant}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
