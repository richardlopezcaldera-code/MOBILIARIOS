import type { Metadata } from "next";
import { Search } from "lucide-react";

import { ProductGrid } from "@/components/site/product-row";
import { getCatalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Buscar",
};

type Props = { searchParams: Promise<{ q?: string }> };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const { products, categories } = await getCatalog();
  const query = q.trim();

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const results = terms.length
    ? products.filter((product) => {
        const haystack = normalize(
          `${product.name} ${product.sku ?? ""} ${product.excerpt}`,
        );
        return terms.every((term) => haystack.includes(term));
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Buscar</h1>

      <form action="/buscar" role="search" className="relative mt-6 max-w-xl">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Escritorio, silla ergonómica, locker…"
          aria-label="Buscar productos"
          className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </form>

      {query && (
        <p className="mt-4 text-sm text-muted-foreground">
          {results.length} resultados para “{query}”
        </p>
      )}

      <div className="mt-8">
        {results.length > 0 ? (
          <ProductGrid products={results.slice(0, 60)} categories={categories} />
        ) : (
          query && (
            <p className="rounded-xl border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              No encontramos productos con ese término. Prueba con una palabra más
              general, por ejemplo “silla” o “mesa”.
            </p>
          )
        )}
      </div>
    </div>
  );
}
