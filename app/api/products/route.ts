import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json(allProducts);
}
