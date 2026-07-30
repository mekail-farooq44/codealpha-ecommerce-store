import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const product = found[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
            {product.category}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold mt-3">${product.price.toFixed(2)}</p>
          <p className="text-neutral-600 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-sm text-neutral-500 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
          </p>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
