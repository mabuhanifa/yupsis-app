"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, error } = useProducts(page, limit);
  console.log("Products data:", data);
  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (data && page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  if (isError) {
    return <div className="text-center py-10">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {isLoading && !data ? (
        <ProductGridSkeleton count={limit} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data &&
            data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm font-medium">
                  Page {page} of {data.totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    page >= data.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
