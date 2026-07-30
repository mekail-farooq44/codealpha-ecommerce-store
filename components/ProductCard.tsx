import Link from "next/link";
import type { Product } from "@/db/schema";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-neutral-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-neutral-900 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          {product.stock === 0 ? (
            <span className="text-xs text-red-500">Out of stock</span>
          ) : product.stock < 5 ? (
            <span className="text-xs text-amber-600">Only {product.stock} left</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
