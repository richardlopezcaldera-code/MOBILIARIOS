import Link from "next/link";

import { Hero } from "@/components/site/hero";
import { ProductRow } from "@/components/site/product-row";
import { TrustBar } from "@/components/site/trust-bar";
import { WholesaleCta } from "@/components/site/wholesale-cta";
import {
  discountedProducts,
  featuredProducts,
  findCategory,
  getCatalog,
  productsInCategory,
  rootCategories,
} from "@/lib/data";

const SHOWCASE = ["escritorios", "sillas", "mesas", "lockers", "estantes-y-repisas"];

export default async function Home() {
  const catalog = await getCatalog();
  const roots = rootCategories(catalog.categories);

  const offers = discountedProducts(catalog.products, 14);
  const featured = featuredProducts(catalog.products, 14);

  const rows = SHOWCASE.map((slug) => {
    const category = findCategory(catalog.categories, slug);
    if (!category) return null;
    return { category, items: productsInCategory(catalog, category).slice(0, 14) };
  }).filter((row) => row !== null);

  return (
    <>
      <Hero total={catalog.products.length} categories={roots} />

      {offers.length > 0 && (
        <ProductRow
          title="Ofertas vigentes"
          subtitle="Productos con precio rebajado en el catálogo"
          products={offers}
          href="/categoria/ofertas-del-dia"
        />
      )}

      <TrustBar />

      {featured.length > 0 && (
        <ProductRow
          title="Destacados"
          subtitle="Seleccionados desde tu catálogo"
          products={featured}
          href="/buscar"
        />
      )}

      {rows.map(({ category, items }) => (
        <ProductRow
          key={category.id}
          title={category.name}
          subtitle={`${category.count} productos disponibles`}
          products={items}
          href={`/categoria/${category.slug}`}
        />
      ))}

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl">
          Todas las categorías
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {roots.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categoria/${category.slug}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary hover:bg-muted/50"
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WholesaleCta />
    </>
  );
}
