import type { MetadataRoute } from "next";

import { articles } from "@/data/blog";
import { getCatalog } from "@/lib/data";
import { SITE_URL } from "@/lib/store";

/**
 * Sitemap dinámico: se arma con el catálogo en vivo, así los productos
 * nuevos entran solos sin tocar código.
 *
 * Se revalida cada hora para no golpear la API en cada visita de un robot.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/mayoristas`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/buscar`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categories: MetadataRoute.Sitemap = catalog.categories.map((category) => ({
    url: `${SITE_URL}/categoria/${category.slug}`,
    changeFrequency: "daily",
    // Las categorías con más productos pesan más.
    priority: category.count > 50 ? 0.9 : 0.7,
  }));

  const products: MetadataRoute.Sitemap = catalog.products.map((product) => ({
    url: `${SITE_URL}/producto/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // `/admin`, `/carro` y `/checkout` quedan fuera a propósito: no aportan
  // nada en búsqueda y no deben indexarse.
  return [...staticPages, ...categories, ...products, ...posts];
}
