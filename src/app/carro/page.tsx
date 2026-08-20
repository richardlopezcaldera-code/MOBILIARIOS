"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { formatCLP } from "@/lib/store";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, total, count, ready, setQuantity, remove, clear } = useCart();

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm text-muted-foreground">Cargando tu carro…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingCart
          className="mx-auto size-10 text-muted-foreground"
          aria-hidden
        />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Tu carro está vacío
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Agrega productos desde el catálogo y aparecerán aquí.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Tu carro
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Vaciar carro
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {count} {count === 1 ? "producto" : "productos"}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border rounded-xl border border-border">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-4 p-4">
              <Link
                href={`/producto/${line.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="96px"
                  className="object-contain p-1"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/producto/${line.slug}`}
                      className="line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {line.name}
                    </Link>
                    {line.sku && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        SKU {line.sku}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`Quitar ${line.name}`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex h-9 items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      aria-label="Quitar una unidad"
                      className="inline-flex size-9 items-center justify-center rounded-l-lg hover:bg-muted"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      aria-label="Agregar una unidad"
                      className="inline-flex size-9 items-center justify-center rounded-r-lg hover:bg-muted"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCLP(line.price * line.quantity)}
                    </p>
                    {line.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatCLP(line.price)} c/u
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-40">
          <h2 className="text-sm font-semibold">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Productos</dt>
              <dd className="tabular-nums">{count}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatCLP(total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            El despacho se cotiza aparte según la dirección de entrega.
          </p>
          <Link
            href="/checkout"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continuar
          </Link>
          <Link
            href="/"
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-muted"
          >
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
