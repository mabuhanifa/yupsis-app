"use client";

import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const { data: product, isLoading, isError, error } = useProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<
    (typeof product.variants)[0] | undefined
  >(undefined);

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
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
        description: `${product.title} (${selectedVariant.title}) has been added to your cart.`,
      });
    } else {
      toast({
        title: "Could not add to cart",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
    }
  };

  const displayPrice = selectedVariant
    ? `$${parseFloat(selectedVariant.price).toFixed(2)}`
    : "N/A";

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {product.vendor}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.title}
            </h1>
          </div>

          <p className="text-3xl font-semibold">{displayPrice}</p>

          <div className="prose max-w-none text-muted-foreground">
            <p>{product.description}</p>
          </div>

          {product.variants && product.variants.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choose a variant</h3>
              <RadioGroup
                value={selectedVariant?.id}
                onValueChange={(variantId) => {
                  const variant = product.variants.find(
                    (v) => v.id === variantId
                  );
                  setSelectedVariant(variant);
                }}
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
                      className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-2 px-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      {variant.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              disabled={!selectedVariant}
            >
              Add to Cart
            </Button>
          </div>

          {selectedVariant && (
            <div className="space-y-1 pt-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold">SKU:</span>{" "}
                {selectedVariant.sku}
              </p>
              {selectedVariant.grams && (
                <p>
                  <span className="font-semibold">Weight:</span>{" "}
                  {selectedVariant.grams}g
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
