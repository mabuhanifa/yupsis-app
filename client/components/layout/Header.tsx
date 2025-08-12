import { CartSheet } from "@/components/cart/CartSheet";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center px-4 shadow-sm">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Yupsis</span>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="/products"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Products
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
