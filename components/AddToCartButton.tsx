"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import type { Product } from "@/db/schema";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm text-neutral-600">
          Qty
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={outOfStock}
          className="border border-neutral-300 rounded-md px-2 py-1.5 text-sm disabled:opacity-50"
        >
          {Array.from({ length: Math.min(product.stock, 10) || 1 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="rounded-md bg-neutral-900 text-white px-4 py-2.5 font-medium hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
      >
        {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
      </button>

      <button
        onClick={() => {
          handleAddToCart();
          router.push("/cart");
        }}
        disabled={outOfStock}
        className="rounded-md border border-neutral-300 px-4 py-2.5 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Buy now
      </button>
    </div>
  );
}
