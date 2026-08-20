import "server-only";

import {
  categories as staticCategories,
  products as staticProducts,
  type Category,
  type Product,
} from "@/lib/catalog";
import { fetchCategories, fetchProducts, isLive } from "@/lib/jumpseller";

export type { Category, Product };

export interface Catalog {
  products: Product[];
  categories: Category[];
  /** true si los datos vienen de la API; false si es el snapshot local. */
  live: boolean;
}

/**
 * Punto único de acceso al catálogo.
 *
 * Con credenciales configuradas lee de Jumpseller (cacheado por ISR y
 * refrescado por webhook). Sin credenciales, o si la API falla, cae al
 * snapshot de `src/data/`: el sitio nunca queda en blanco.
 */
export async function getCatalog(): Promise<Catalog> {
  if (!isLive) {
    return { products: staticProducts, categories: staticCategories, live: false };
  }

  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  if (!products || !categories) {
    console.warn("[catálogo] la API no respondió; usando el snapshot local");
    return { products: staticProducts, categories: staticCategories, live: false };
  }

  return { products, categories, live: true };
}

// --- Consultas derivadas -------------------------------------------------

export function rootCategories(categories: Category[]): Category[] {
  return categories
    .filter((category) => category.parentId === null)
    .sort((a, b) => b.count - a.count);
}

export function childrenOf(categories: Category[], id: number): Category[] {
  return categories.filter((category) => category.parentId === id);
}

export function findCategory(
  categories: Category[],
  slug: string,
): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function findProduct(
  products: Product[],
  slug: string,
): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function productsInCategory(
  catalog: Catalog,
  category: Category,
): Product[] {
  const ids = new Set<number>([category.id]);
  for (const child of childrenOf(catalog.categories, category.id)) {
    ids.add(child.id);
  }
  return catalog.products.filter((product) =>
    product.categories.some((id) => ids.has(id)),
  );
}

export function featuredProducts(products: Product[], limit = 12): Product[] {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function discountedProducts(products: Product[], limit = 12): Product[] {
  return products
    .filter((product) => product.compareAt !== null && product.compareAt > product.price)
    .slice(0, limit);
}

export function relatedProducts(
  products: Product[],
  product: Product,
  limit = 8,
): Product[] {
  const ids = new Set(product.categories);
  return products
    .filter((item) => item.id !== product.id && item.categories.some((id) => ids.has(id)))
    .slice(0, limit);
}
