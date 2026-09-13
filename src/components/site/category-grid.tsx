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

      {/* Dos por fila desde el telefono: a una sola columna las tarjetas
          quedan enormes y casi vacias, y obligan a scrollear el catalogo. */}
      <ul className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {destacadas.map((category) => {
          const meta = META[category.slug];
          const Icon = meta?.icon ?? LayoutPanelTop;
          return (
            <li key={category.id}>
              <Link
                href={`/categoria/${category.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="flex h-24 items-center justify-center bg-muted/60 sm:h-32 lg:h-36">
                  <Icon
                    className="size-10 text-primary/45 transition-colors group-hover:text-primary/70 sm:size-12 lg:size-14"
                    strokeWidth={1.1}
                    aria-hidden
                  />
                </div>
                <div className="px-3 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-tight font-semibold sm:text-base">
                      {category.name}
                    </p>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-bold sm:text-sm">
                      {category.count}
                    </span>
                  </div>
                  {meta && (
                    <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                      {meta.detail}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
