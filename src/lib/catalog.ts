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

export function discountPercent(product: Product): number | null {
  if (!product.compareAt || product.compareAt <= product.price) return null;
  return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
}

export function inStock(product: Product): boolean {
  return product.unlimited || product.stock > 0;
}
