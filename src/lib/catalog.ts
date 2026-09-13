import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  sku: string | null;
  brand: string | null;
  stock: number;
  unlimited: boolean;
  featured: boolean;
  images: string[];
  excerpt: string;
  description: string;
  categories: number[];
  variants: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  count: number;
}

export const products = productsData as Product[];
export const categories = categoriesData as Category[];

const bySlug = new Map(products.map((p) => [p.slug, p]));
const catBySlug = new Map(categories.map((c) => [c.slug, c]));
const catById = new Map(categories.map((c) => [c.id, c]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getCategory(slug: string): Category | undefined {
  return catBySlug.get(slug);
}

export function getCategoryById(id: number): Category | undefined {
  return catById.get(id);
}

export function rootCategories(): Category[] {
  return categories
    .filter((c) => c.parentId === null)
    .sort((a, b) => b.count - a.count);
}

export function childrenOf(id: number): Category[] {
  return categories.filter((c) => c.parentId === id);
}

/** Productos de una categoría, incluyendo los de sus subcategorías. */
export function productsInCategory(category: Category): Product[] {
  const ids = new Set<number>([category.id]);
  for (const child of childrenOf(category.id)) ids.add(child.id);
  return products.filter((p) => p.categories.some((id) => ids.has(id)));
}

export function featuredProducts(limit = 12): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function discountedProducts(limit = 12): Product[] {
  return products
    .filter((p) => p.compareAt !== null && p.compareAt > p.price)
    .slice(0, limit);
}

export function relatedProducts(product: Product, limit = 8): Product[] {
  const ids = new Set(product.categories);
  return products
    .filter((p) => p.id !== product.id && p.categories.some((id) => ids.has(id)))
    .slice(0, limit);
}

/**
 * Ruta de categorías del producto, de la raíz a la más específica.
 * Ej: [Sillas, Sillas Ejecutivas y Ergonómicas].
 *
 * Un producto suele estar en la raíz y en la subcategoría a la vez; la
 * subcategoría dice más, así que es la que manda y desde ella se sube.
 */
export function categoryTrail(
  categoryList: Category[],
  product: Product,
): Category[] {
  const own = product.categories
    .map((id) => categoryList.find((item) => item.id === id))
    .filter((item): item is Category => item !== undefined);
  if (own.length === 0) return [];

  const leaf = own.find((item) => item.parentId !== null) ?? own[0];
  const trail: Category[] = [leaf];
  const seen = new Set<number>([leaf.id]);
  let cursor = leaf;

  while (cursor.parentId !== null) {
    const parent = categoryList.find((item) => item.id === cursor.parentId);
    if (!parent || seen.has(parent.id)) break;
    seen.add(parent.id);
    trail.unshift(parent);
    cursor = parent;
  }

  return trail;
}

/** Nombre de la categoría más específica del producto, para la tarjeta. */
export function categoryLabel(
  categoryList: Category[],
  product: Product,
): string | null {
  const trail = categoryTrail(categoryList, product);
  return trail.length > 0 ? trail[trail.length - 1].name : null;
}

export function discountPercent(product: Product): number | null {
  if (!product.compareAt || product.compareAt <= product.price) return null;
  return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
}

export function inStock(product: Product): boolean {
  return product.unlimited || product.stock > 0;
}
