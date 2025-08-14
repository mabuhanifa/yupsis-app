"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGetProduct, useUpdateProduct } from "@/hooks/useProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  vendor: z.string().min(2, {
    message: "Vendor must be at least 2 characters.",
  }),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data: product, isLoading, isError } = useGetProduct(id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      vendor: "",
      description: "",
      image: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        vendor: product.vendor,
        description: product.description || "",
        image: product.image || "",
      });
    }
  }, [product, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProduct(
      { id, ...values },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Product updated successfully.",
          });
          router.push("/admin/products");
        },
        onError: (error: any) => {
          toast({
            title: "Update Failed",
            description:
              error.response?.data?.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        },
      }
    );
  }

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4">Error loading product.</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <FormControl>
                  <Input placeholder="Product vendor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.png"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Variants</h2>
        {product?.variants && product.variants.length > 0 ? (
          <ul className="space-y-4">
            {product.variants.map((variant: any) => (
              <li key={variant.id} className="p-4 border rounded-md">
                <p>
                  <strong>Title:</strong> {variant.title}
                </p>
                <p>
                  <strong>SKU:</strong> {variant.sku}
                </p>
                <p>
                  <strong>Price:</strong> {variant.price}
                </p>
                {variant.cost && (
                  <p>
                    <strong>Cost:</strong> {variant.cost}
                  </p>
                )}
                {variant.grams && (
                  <p>
                    <strong>Grams:</strong> {variant.grams}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>This product has no variants.</p>
        )}
      </div>
    </div>
  );
}
