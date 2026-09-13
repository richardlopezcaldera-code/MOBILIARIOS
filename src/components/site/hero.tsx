import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import type { Category } from "@/lib/catalog";

export function Hero({
  total,
  categories,
}: {
  total: number;
  categories: Category[];
}) {
  const shortcuts = categories.slice(0, 6);

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 to-background">
      {/* Marca de agua: emblema MTC centrado, decorativo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/images/emblema-mtc.png"
          alt=""
          width={480}
          height={480}
          priority={false}
          className="w-[320px] max-w-[85%] opacity-[0.06] sm:w-[460px] lg:w-[620px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            Venta corporativa
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Equipe la oficina completa con una sola contraparte
          </h1>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            {total.toLocaleString("es-CL")} productos en catálogo, cotización formal
            por volumen y despacho a todo Chile. Atendemos empresas, colegios,
            clínicas y restaurantes con factura y orden de compra.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mayoristas"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Solicitar cotización por volumen
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/categoria/ofertas-del-dia"
              className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              Ver ofertas
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 shrink-0 text-primary" aria-hidden />
            Respuesta en <strong className="font-semibold text-foreground">24 horas</strong>
            {" "}· sin monto mínimo de compra
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {shortcuts.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categoria/${category.slug}`}
                className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-muted/50"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="mt-3 text-xs text-muted-foreground">
                  {category.count} productos
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
