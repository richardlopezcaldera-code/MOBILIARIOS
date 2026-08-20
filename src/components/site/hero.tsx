import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { rootCategories } from "@/lib/catalog";

export function Hero({ total }: { total: number }) {
  const shortcuts = rootCategories().slice(0, 6);

  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/60 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">
            Mobiliario para oficina, hogar, gastronomía e industria
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {total.toLocaleString("es-CL")} productos listos para cotizar
          </h1>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            Escritorios, sillas ergonómicas, mesas de reunión, lockers, estantería
            y equipamiento para tu espacio de trabajo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/categoria/ofertas-del-dia"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ver ofertas
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/mayoristas"
              className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              Cotizar por volumen
            </Link>
          </div>
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
