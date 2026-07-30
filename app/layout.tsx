import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Shopfront — Simple E-commerce Store",
  description: "A simple e-commerce store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
              Shopfront demo store — built with Next.js
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
