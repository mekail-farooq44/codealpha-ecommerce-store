"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { totalItems } = useCart();

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-neutral-900">
          MekaShop
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-neutral-700">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Shop
          </Link>

          {status === "authenticated" && (
            <Link href="/orders" className="hover:text-neutral-900 transition-colors">
              My Orders
            </Link>
          )}

          <Link href="/cart" className="relative hover:text-neutral-900 transition-colors">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 hidden sm:inline">
                Hi, {session.user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            status !== "loading" && (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-neutral-900 text-white px-3 py-1.5 hover:bg-neutral-800 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
