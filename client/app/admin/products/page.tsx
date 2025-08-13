"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useImportFromSSActiveWear } from "@/hooks/useIntegrations";
import { useProducts } from "@/hooks/useProducts";
import { Download } from "lucide-react";
import { columns } from "./columns";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const { data: productsData, isLoading } = useProducts({ limit: 100 }); // Fetch more for admin view
  const { mutate: importProducts, isPending } = useImportFromSSActiveWear();

  const handleImport = () => {
    importProducts(undefined, {
      onSuccess: () => {
        toast({
          title: "Import Started",
          description:
            "Product import from SSActiveWear has been queued successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Import Failed",
          description:
            error.response?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={handleImport} disabled={isPending}>
          <Download className="mr-2 h-4 w-4" />
          {isPending ? "Importing..." : "Import from SSActiveWear"}
        </Button>
      </div>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <DataTable columns={columns} data={productsData?.data || []} />
      )}
    </div>
  );
}
