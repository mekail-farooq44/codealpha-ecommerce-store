"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-neutral-500">Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Please log in to checkout</h1>
        <p className="text-neutral-500 mb-6">You need an account to place an order.</p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-neutral-900 text-white px-5 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <Link href="/" className="text-neutral-600 hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName,
          shippingAddress,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/orders?success=1`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Checkout</h1>

      <div className="border border-neutral-200 rounded-lg p-5 mb-6 bg-white">
        <h2 className="font-medium mb-3">Order summary</h2>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-neutral-200">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="shippingName" className="block text-sm font-medium mb-1">
            Full name
          </label>
          <input
            id="shippingName"
            type="text"
            required
            value={shippingName}
            onChange={(e) => setShippingName(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="shippingAddress" className="block text-sm font-medium mb-1">
            Shipping address
          </label>
          <textarea
            id="shippingAddress"
            required
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-neutral-900 text-white px-5 py-3 font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Placing order..." : `Place order — $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
