"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDeployToShopify } from "@/hooks/useIntegrations";
import { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

function ProductActions({ product }: { product: Product }) {
  const { toast } = useToast();
  const { mutate: deploy, isPending } = useDeployToShopify();
  const router = useRouter();

  const handleDeploy = () => {
    deploy(product.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Product "${product.title}" has been deployed to Shopify.`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Deployment Failed",
          description:
            error.response?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      },
    });
  };

  const handleEdit = () => {
    router.push(`/admin/products/${product.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeploy} disabled={isPending}>
          <Rocket className="mr-2 h-4 w-4" />
          {isPending ? "Deploying..." : "Deploy to Shopify"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => row.original.variants.length,
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
];
