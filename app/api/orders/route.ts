import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { authOptions } from "@/lib/auth";

const orderSchema = z.object({
  shippingName: z.string().min(1),
  shippingAddress: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Cart is empty"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid order" },
        { status: 400 }
      );
    }

    const { shippingName, shippingAddress, items } = parsed.data;

    // Fetch product details & validate stock
    let total = 0;
    const resolvedItems: {
      productId: string;
      productName: string;
      quantity: number;
      priceAtPurchase: number;
    }[] = [];

    for (const item of items) {
      const found = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);
      const product = found[0];

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}` },
          { status: 400 }
        );
      }

      total += product.price * item.quantity;
      resolvedItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    const orderId = randomUUID();

    await db.insert(orders).values({
      id: orderId,
      userId,
      status: "paid",
      total,
      shippingName,
      shippingAddress,
      createdAt: new Date().toISOString(),
    });

    for (const item of resolvedItems) {
      await db.insert(orderItems).values({
        id: randomUUID(),
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      });

      const found = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);
      const currentStock = found[0].stock;

      await db
        .update(products)
        .set({ stock: currentStock - item.quantity })
        .where(eq(products.id, item.productId));
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    })
  );

  return NextResponse.json(ordersWithItems);
}
