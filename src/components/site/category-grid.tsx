import Link from "next/link";
import {
  Armchair,
  BookOpen,
  LayoutPanelTop,
  Lock,
  Presentation,
  Table2,
  type LucideIcon,
} from "lucide-react";

import type { Category } from "@/lib/catalog";

/** Icono y bajada por slug. Lo que no esté aquí cae en el genérico. */
const META: Record<string, { icon: LucideIcon; detail: string }> = {
  sillas: { icon: Armchair, detail: "Ergonómicas, visita, banquetas" },
  mesas: { icon: Table2, detail: "Reunión, comedor, auxiliares" },
  escritorios: { icon: LayoutPanelTop, detail: "Rectos, en L, estaciones" },
  "estantes-y-repisas": { icon: BookOpen, detail: "Bodega, archivo, melamina" },
  lockers: { icon: Lock, detail: "Metálicos y de madera" },
  "pizarras-y-murales": { icon: Presentation, detail: "Salas de reunión y colegios" },
};

export function CategoryGrid({
  categories,
  total,
}: {
  categories: Category[];
  total: number;
}) {
  const destacadas = categories.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Catálogo por línea
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Todo el catálogo cotiza por volumen, no solo las líneas destacadas.
          </p>
        </div>
        <Link
          href="/buscar"
          className="border-b-2 border-gold pb-0.5 text-sm font-medium hover:text-primary"
        >
          Ver las {total} categorías
        </Link>
      </div>

      <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destacadas.map((category) => {
          const meta = META[category.slug];
          const Icon = meta?.icon ?? LayoutPanelTop;
          return (
            <li key={category.id}>
              <Link
                href={`/categoria/${category.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="flex h-36 items-center justify-center bg-muted/60">
                  <Icon
                    className="size-14 text-primary/45 transition-colors group-hover:text-primary/70"
                    strokeWidth={1.1}
                    aria-hidden
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    {meta && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {meta.detail}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-sm font-bold">
                    {category.count}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
