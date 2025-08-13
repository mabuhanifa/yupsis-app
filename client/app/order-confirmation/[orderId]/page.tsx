"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId;

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          <p>
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
          <p className="text-sm text-muted-foreground">
            You will receive an email confirmation shortly.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
