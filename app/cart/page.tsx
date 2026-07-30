"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-neutral-500 mb-6">Browse our products and add something you like.</p>
        <Link
          href="/"
          className="inline-block rounded-md bg-neutral-900 text-white px-5 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Your cart</h1>

      <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md bg-neutral-100"
            />
            <div className="flex-1">
              <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-neutral-500 mt-1">${item.price.toFixed(2)} each</p>
            </div>

            <select
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="border border-neutral-300 rounded-md px-2 py-1.5 text-sm"
            >
              {Array.from({ length: Math.min(item.stock, 10) || 1 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="font-medium w-20 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-neutral-400 hover:text-red-500 transition-colors ml-2"
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Link href="/" className="text-sm text-neutral-600 hover:underline">
          ← Continue shopping
        </Link>
        <div className="text-right">
          <p className="text-neutral-500 text-sm">Total</p>
          <p className="text-2xl font-semibold">${totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/checkout"
          className="rounded-md bg-neutral-900 text-white px-6 py-3 font-medium hover:bg-neutral-800 transition-colors"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
