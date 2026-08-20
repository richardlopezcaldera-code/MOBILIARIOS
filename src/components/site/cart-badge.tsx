"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { count, ready } = useCart();

  return (
    <Link
      href="/carro"
      aria-label={
        count > 0 ? `Carro de compras, ${count} productos` : "Carro de compras"
      }
      className="relative inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted"
    >
      <ShoppingCart className="size-5" />
      {ready && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--offer)] px-1 text-[11px] font-semibold text-[var(--offer-foreground)] tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
