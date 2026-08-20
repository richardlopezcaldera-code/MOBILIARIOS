import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/site/product-row";
import {
  childrenOf,
  findCategory,
  getCatalog,
  productsInCategory,
} from "@/lib/data";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

const PER_PAGE = 48;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { categories } = await getCatalog();
  const category = findCategory(categories, slug.join("/"));
  if (!category) return { title: "Categoría no encontrada" };
  return {
    title: category.name,
    description: `${category.count} productos en ${category.name}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const catalog = await getCatalog();
  const category = findCategory(catalog.categories, slug.join("/"));
  if (!category) notFound();

  const items = productsInCategory(catalog, category);
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const visible = items.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const subs = childrenOf(catalog.categories, category.id);
  const parent = category.parentId
    ? catalog.categories.find((item) => item.id === category.parentId)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Ruta" className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        {parent && (
          <>
            {" / "}
            <Link
              href={`/categoria/${parent.slug}`}
              className="hover:text-foreground"
            >
              {parent.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-foreground">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {category.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} productos
      </p>

      {subs.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {subs.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/categoria/${sub.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:bg-muted/50"
              >
                {sub.name}
                <span className="text-xs text-muted-foreground">{sub.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        {items.length > 0 ? (
          <ProductGrid products={visible} />
        ) : (
          <p className="rounded-xl border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            Esta categoría todavía no tiene productos publicados.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Paginación"
          className="mt-10 flex items-center justify-center gap-2"
        >
          {current > 1 && (
            <Link
              href={`/categoria/${category.slug}?page=${current - 1}`}
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm hover:bg-muted"
            >
              Anterior
            </Link>
          )}
          <span className="px-3 text-sm text-muted-foreground">
            Página {current} de {totalPages}
          </span>
          {current < totalPages && (
            <Link
              href={`/categoria/${category.slug}?page=${current + 1}`}
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm hover:bg-muted"
            >
              Siguiente
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
