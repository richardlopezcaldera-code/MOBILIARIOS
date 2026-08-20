import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ShoppingCart } from "lucide-react";

import { STORE, whatsappLink } from "@/lib/store";

export const metadata: Metadata = {
  title: "Carro de compras",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <ShoppingCart className="mx-auto size-10 text-muted-foreground" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Carro de compras</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        El checkout todavía no está conectado en esta versión. Por ahora las
        compras se cierran por WhatsApp o correo, y la tienda activa sigue
        operando con normalidad.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={whatsappLink("Hola, quiero hacer un pedido.")}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <MessageCircle className="size-4" aria-hidden />
          Comprar por WhatsApp
        </a>
        <a
          href={STORE.url}
          className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted"
        >
          Ir a la tienda actual
        </a>
      </div>
      <p className="mt-8 text-sm">
        <Link href="/" className="text-primary hover:underline">
          Volver al catálogo
        </Link>
      </p>
    </div>
  );
}
