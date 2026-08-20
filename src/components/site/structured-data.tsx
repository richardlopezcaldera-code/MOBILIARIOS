import { SITE_URL, STORE } from "@/lib/store";
import type { Category, Product } from "@/lib/catalog";
import { inStock } from "@/lib/catalog";

/**
 * Datos estructurados JSON-LD.
 *
 * Sirven para que Google entienda qué hay en cada página y pueda mostrar
 * precio, stock y migas de pan directamente en los resultados.
 *
 * Nota sobre el precio: se declara el mismo valor NETO que muestra la
 * página. Google exige que el precio del marcado coincida con el visible;
 * el IVA se suma en el checkout, igual que en la tienda actual.
 */

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es JSON generado por nosotros, no entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Store",
        name: STORE.name,
        legalName: STORE.legalName,
        url: SITE_URL,
        image: STORE.logo,
        email: STORE.email,
        telephone: `+${STORE.whatsapp}`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: STORE.address.street,
          addressLocality: STORE.address.city,
          addressRegion: STORE.address.region,
          postalCode: STORE.address.postal,
          addressCountry: "CL",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: STORE.address.latitude,
          longitude: STORE.address.longitude,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductSchema({
  product,
  category,
}: {
  product: Product;
  category?: Category;
}) {
  const available = inStock(product);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.excerpt || product.name,
        image: product.images,
        sku: product.sku ?? undefined,
        brand: product.brand
          ? { "@type": "Brand", name: product.brand }
          : { "@type": "Brand", name: STORE.name },
        category: category?.name,
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/producto/${product.slug}`,
          priceCurrency: "CLP",
          price: product.price,
          availability: available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: STORE.name },
        },
      }}
    />
  );
}

export function BreadcrumbSchema({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((step, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: step.name,
          item: `${SITE_URL}${step.path}`,
        })),
      }}
    />
  );
}

export function ArticleSchema({
  title,
  summary,
  slug,
}: {
  title: string;
  summary: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: summary,
        url: `${SITE_URL}/blog/${slug}`,
        publisher: {
          "@type": "Organization",
          name: STORE.name,
          logo: { "@type": "ImageObject", url: STORE.logo },
        },
      }}
    />
  );
}
