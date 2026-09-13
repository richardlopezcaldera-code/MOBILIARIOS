"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import { usePrefersReducedMotion } from "@/lib/client-preferences";
import type { Category, Product } from "@/lib/catalog";

const INTERVAL_MS = 15_000;
/** Avanza de a 10: cada rotación muestra un grupo completamente nuevo. */
const STEP = 10;

/**
 * Fila de productos que rota cada 15 s, de a 10 productos, recorriendo
 * toda la categoría.
 *
 * Se detiene sola cuando conviene: al pasar el mouse o el foco por encima
 * (para no mover algo que el cliente está mirando), cuando la pestaña queda
 * en segundo plano, y si el sistema pide menos movimiento. También se puede
 * pausar a mano.
 */
export function RotatingRow({
  title,
  subtitle,
  products,
  categories,
  href,
  visible = 10,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  categories?: Category[];
  href?: string;
  visible?: number;
}) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const allowed = !usePrefersReducedMotion();

  const rotates = products.length > visible;

  useEffect(() => {
    if (!rotates || !allowed || paused || hovered) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setOffset((current) => (current + STEP) % products.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [rotates, allowed, paused, hovered, products.length]);

  const shown = useMemo(() => {
    if (!rotates) return products;
    return Array.from(
      { length: visible },
      (_, index) => products[(offset + index) % products.length],
    );
  }, [products, offset, visible, rotates]);

  function step(direction: 1 | -1) {
    setOffset((current) => {
      const next = current + direction * STEP;
      return ((next % products.length) + products.length) % products.length;
    });
    listRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {rotates && allowed && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Ver productos anteriores"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Ver más productos"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Reanudar rotación" : "Pausar rotación"}
                aria-pressed={paused}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
              >
                {paused ? (
                  <Play className="size-4" />
                ) : (
                  <Pause className="size-4" />
                )}
              </button>
            </>
          )}
          {href && (
            <Link
              href={href}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver todo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <ul
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]"
        aria-live="off"
      >
        {shown.map((product, index) => (
          <li
            key={`${product.id}-${index}`}
            className="w-44 shrink-0 snap-start sm:w-52 lg:w-56"
          >
            <ProductCard product={product} categories={categories} />
          </li>
        ))}
      </ul>

      {rotates && (
        <p className="mt-2 text-xs text-muted-foreground">
          Mostrando {visible} de {products.length}
          {allowed && !paused && !hovered && " · rota cada 15 s"}
          {paused && " · pausado"}
        </p>
      )}
    </section>
  );
}
