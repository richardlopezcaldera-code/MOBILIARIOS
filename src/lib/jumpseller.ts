import "server-only";

import type { Category, Product } from "@/lib/catalog";

/**
 * Cliente de la API de Jumpseller.
 *
 * Si no hay credenciales configuradas, todo devuelve null y el sitio usa el
 * snapshot estático de `src/data/`. Así nunca se cae por falta de conexión:
 * en el peor caso muestra el catálogo de la última exportación.
 *
 * Límites de la API: 800 req/min y 20 req/s. Con revalidación cada 10 minutos
 * el consumo real son ~10 llamadas por ventana.
 */

// Configurable solo para poder apuntar a un servidor de prueba.
const BASE = process.env.JUMPSELLER_API_BASE ?? "https://api.jumpseller.com/v1";
const LOGIN = process.env.JUMPSELLER_LOGIN;
const TOKEN = process.env.JUMPSELLER_AUTHTOKEN;

export const isLive = Boolean(LOGIN && TOKEN);

/** Etiqueta de caché: el webhook la invalida para refrescar al instante. */
export const CATALOG_TAG = "catalog";

const REVALIDATE_SECONDS = 600;

function authHeader(): string {
  return `Basic ${Buffer.from(`${LOGIN}:${TOKEN}`).toString("base64")}`;
}

async function api<T>(path: string): Promise<T | null> {
  if (!isLive) return null;
  try {
    const response = await fetch(`${BASE}/${path}`, {
      headers: { Authorization: authHeader() },
      next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOG_TAG] },
    });
    if (!response.ok) {
      console.error(`[jumpseller] ${path} respondió ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[jumpseller] falló ${path}`, error);
    return null;
  }
}

interface ApiImage {
  url: string;
  position?: number;
}

interface ApiProduct {
  id: number;
  name: string;
  permalink: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  brand: string | null;
  stock: number;
  stock_unlimited: boolean;
  featured: boolean;
  status: string;
  description: string | null;
  images: ApiImage[];
  variants: unknown[];
  categories: { id: number }[];
}

interface ApiCategory {
  id: number;
  name: string;
  permalink: string;
  parent_id: number | null;
  products: { id: number }[];
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function toProduct(raw: ApiProduct): Product {
  const description = stripHtml(raw.description);
  return {
    id: raw.id,
    name: raw.name.trim(),
    slug: raw.permalink,
    price: raw.price,
    compareAt: raw.compare_at_price,
    sku: raw.sku,
    brand: raw.brand,
    stock: raw.stock,
    unlimited: raw.stock_unlimited,
    featured: raw.featured,
    images: [...raw.images]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((image) => image.url)
      .slice(0, 3),
    excerpt: description.slice(0, 280),
    description: description.slice(0, 1500),
    categories: raw.categories?.map((category) => category.id) ?? [],
    variants: raw.variants?.length ?? 0,
  };
}

/** Trae el catálogo completo, paginando de a 100. */
export async function fetchProducts(): Promise<Product[] | null> {
  if (!isLive) return null;

  const all: Product[] = [];
  const MAX_PAGES = 30;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await api<{ product: ApiProduct }[]>(
      `products.json?limit=100&page=${page}&status=available`,
    );
    if (batch === null) return all.length > 0 ? all : null;
    if (batch.length === 0) break;

    for (const item of batch) {
      const product = toProduct(item.product);
      if (product.images.length > 0 && product.sku !== "demo-product") {
        all.push(product);
      }
    }
    if (batch.length < 100) break;
  }

  if (all.length === 0) return null;
  all.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return all;
}

export async function fetchCategories(): Promise<Category[] | null> {
  const raw = await api<{ category: ApiCategory }[]>("categories.json");
  if (raw === null) return null;

  const categories = raw
    .map((item) => item.category)
    .filter((category) => category.permalink !== "all")
    .map<Category>((category) => ({
      id: category.id,
      name: category.name,
      slug: category.permalink,
      parentId: category.parent_id,
      count: category.products?.length ?? 0,
    }));

  return categories.length > 0 ? categories : null;
}
