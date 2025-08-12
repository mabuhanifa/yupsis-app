"use client";

import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/stores/cartStore";
import { Variant } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const { data: product, isLoading, isError, error } = useProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (product && product.variants.length === 1) {
      setSelectedVariant(product.variants[0]);
    } else if (product) {
      setSelectedVariant(null);
    }
  }, [product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return <div className="text-center py-10">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    setSelectedVariant(variant || null);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItemToCart({
        id: selectedVariant.id,
        title: `${product.title} - ${selectedVariant.title}`,
        price: parseFloat(selectedVariant.price),
        image: product.image,
        quantity: 1,
      });
      toast({
        title: "Added to cart",
        description: `${product.title} - ${selectedVariant.title} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Select a variant",
        description: "Please select a variant before adding to cart.",
        variant: "destructive",
      });
    }
  };

  const displayPrice = selectedVariant
    ? `$${parseFloat(selectedVariant.price).toFixed(2)}`
    : product.variants.length > 0
    ? `$${parseFloat(product.variants[0].price).toFixed(2)}`
    : "N/A";

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full">
          <Image
            src={
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

          {product.variants.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Variants</h3>
              <RadioGroup
                onValueChange={handleVariantChange}
                className="flex flex-wrap gap-2"
              >
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <RadioGroupItem
                      value={variant.id}
                      id={variant.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={variant.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      {variant.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={
                (product.variants.length > 1 && !selectedVariant) ||
                selectedVariant?.inventory?.quantity === 0
              }
              size="lg"
            >
              {selectedVariant?.inventory?.quantity === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>
            {selectedVariant && selectedVariant.inventory && (
              <p className="text-sm text-center text-muted-foreground">
                {selectedVariant.inventory.quantity > 0
                  ? `${selectedVariant.inventory.quantity} in stock`
                  : "Out of stock"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
