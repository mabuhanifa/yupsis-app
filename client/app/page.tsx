import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Yupsis E-Commerce</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/products">View Products</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard">Go to Admin</Link>
        </Button>
      </div>
    </div>
  );
}
