"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
};

type Order = {
  id: string;
  status: string;
  total: number;
  shippingName: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-16 text-center text-neutral-500">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const justPlaced = searchParams.get("success") === "1";

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-neutral-500">Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Please log in</h1>
        <p className="text-neutral-500 mb-6">Log in to view your order history.</p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-neutral-900 text-white px-5 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">My orders</h1>

      {justPlaced && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 mb-6 text-sm">
          Order placed successfully!
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 mb-6">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="inline-block rounded-md bg-neutral-900 text-white px-5 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-200 rounded-lg p-5 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide bg-neutral-100 text-neutral-700 rounded-full px-3 py-1">
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-sm text-neutral-600 border-t border-neutral-100 pt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-neutral-100">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              <p className="text-xs text-neutral-400 mt-2">
                Shipping to {order.shippingName}, {order.shippingAddress}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
