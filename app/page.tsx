import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shop our products</h1>
        <p className="text-neutral-500 mt-1">
          {allProducts.length} products across {categories.length} categories
        </p>
      </div>

      {allProducts.length === 0 ? (
        <p className="text-neutral-500">No products yet. Run the seed script to add some.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
