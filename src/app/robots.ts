import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Páginas sin valor en búsqueda, o que no deben ser públicas.
      disallow: ["/admin", "/carro", "/checkout", "/api/", "/buscar?"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
