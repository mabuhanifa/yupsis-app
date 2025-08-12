"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [category, setCategory] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const limit = 12;

  const { data, isLoading, isError, error } = useProducts({
    page,
    limit,
    search: debouncedSearchTerm,
    sortBy,
    order,
    category,
  });

  const { data: categories } = useCategories();

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, sortBy, order, category]);

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (data && page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? "" : value);
  };

  if (isError) {
    return <div className="text-center py-10">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />
        <Select value={category || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="title">Name</SelectItem>
            </SelectContent>
          </Select>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && !data?.data ? (
        <ProductGridSkeleton count={limit} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data.map((product) => (
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
