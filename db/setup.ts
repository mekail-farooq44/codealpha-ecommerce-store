import "dotenv/config";
import { createClient } from "@libsql/client";
import { randomUUID } from "crypto";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      total REAL NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL
    );
  `);

  const existing = await client.execute(
    "SELECT COUNT(*) as count FROM products"
  );

  const count = Number(existing.rows[0].count);

  if (count === 0) {
    const sampleProducts = [
      {
        name: "Wireless Headphones",
        description:
          "Over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
        price: 89.99,
        imageUrl: "/products/headphones.jpg",
        category: "Electronics",
        stock: 25,
      },
      {
        name: "Smart Watch",
        description:
          "Fitness tracking smart watch with heart-rate monitor, GPS, and week-long battery life.",
        price: 149.99,
        imageUrl: "/products/smartwatch.jpg",
        category: "Electronics",
        stock: 15,
      },
      {
        name: "Canvas Backpack",
        description:
          "Durable canvas backpack with padded laptop sleeve, perfect for daily commutes.",
        price: 45.5,
        imageUrl: "/products/backpack.jpg",
        category: "Accessories",
        stock: 40,
      },
      {
        name: "Ceramic Coffee Mug",
        description:
          "Handcrafted ceramic mug, microwave and dishwasher safe, 12oz capacity.",
        price: 14.99,
        imageUrl: "/products/mug.jpg",
        category: "Home",
        stock: 100,
      },
      {
        name: "Running Shoes",
        description:
          "Lightweight running shoes with breathable mesh upper and responsive cushioning.",
        price: 79.0,
        imageUrl: "/products/shoes.jpg",
        category: "Footwear",
        stock: 30,
      },
      {
        name: "Desk Lamp",
        description:
          "Adjustable LED desk lamp with 3 brightness levels and USB charging port.",
        price: 32.99,
        imageUrl: "/products/lamp.jpg",
        category: "Home",
        stock: 20,
      },
      {
        name: "Leather Wallet",
        description:
          "Slim genuine leather wallet with RFID-blocking technology.",
        price: 28.0,
        imageUrl: "/products/wallet.jpg",
        category: "Accessories",
        stock: 50,
      },
      {
        name: "Bluetooth Speaker",
        description:
          "Portable waterproof Bluetooth speaker with 12-hour playtime.",
        price: 59.99,
        imageUrl: "/products/speaker.jpg",
        category: "Electronics",
        stock: 35,
      },
    ];

    for (const p of sampleProducts) {
      await client.execute({
        sql: `
          INSERT INTO products
          (id, name, description, price, image_url, category, stock, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          randomUUID(),
          p.name,
          p.description,
          p.price,
          p.imageUrl,
          p.category,
          p.stock,
          new Date().toISOString(),
        ],
      });
    }

    console.log(`Seeded ${sampleProducts.length} products.`);
  } else {
    console.log("Products already seeded, skipping.");
  }

  console.log("Database setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});