import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, X } from "lucide-react";

import { AddToCart } from "@/components/site/add-to-cart";
import { ProductGrid } from "@/components/site/product-row";
import {
  BreadcrumbSchema,
  ProductSchema,
} from "@/components/site/structured-data";
import { STORE, formatCLP, whatsappLink } from "@/lib/store";
import { categoryTrail, discountPercent, inStock } from "@/lib/catalog";
import { findProduct, getCatalog, relatedProducts } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const product = findProduct(products, slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    // Solo el nombre: el template del layout ya agrega "| Mobiliarios Tech".
    title: product.name,
    description: product.excerpt || undefined,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.excerpt || undefined,
      images: product.images.slice(0, 1),
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = findProduct(catalog.products, slug);
  if (!product) notFound();

  const discount = discountPercent(product);
  const available = inStock(product);
  const related = relatedProducts(catalog.products, product);
  const categories = product.categories
    .map((id) => catalog.categories.find((item) => item.id === id))
    .filter((item) => item !== undefined);
  // Ruta completa (Sillas / Sillas Ejecutivas y Ergonómicas): el comprador
  // necesita ver a qué familia pertenece lo que está mirando.
  const trail = categoryTrail(catalog.categories, product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ProductSchema product={product} category={categories[0]} />
      <BreadcrumbSchema
        trail={[
          { name: "Inicio", path: "/" },
          ...trail.map((category) => ({
            name: category.name,
            path: `/categoria/${category.slug}`,
          })),
          { name: product.name, path: `/producto/${product.slug}` },
        ]}
      />
      <nav
        aria-label="Ruta"
        className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        {trail.map((category) => (
          <span key={category.id} className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            <Link
              href={`/categoria/${category.slug}`}
              className="font-medium text-primary hover:underline"
            >
              {category.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <ul className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(1).map((src) => (
                <li
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image
                    src={src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="25vw"
                    className="object-contain p-2"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {product.sku && <span>SKU {product.sku}</span>}
            {product.brand && <span>{product.brand}</span>}
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCLP(product.price)}</span>
            {discount !== null && product.compareAt && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatCLP(product.compareAt)}
                </span>
                <span className="rounded-md bg-[var(--offer)] px-2 py-1 text-xs font-semibold text-[var(--offer-foreground)]">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p
            className={`mt-4 inline-flex items-center gap-2 text-sm ${
              available ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            {available ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <X className="size-4" aria-hidden />
            )}
            {available ? "Disponible" : "Sin stock"}
          </p>

          <AddToCart
            className="mt-6"
            withQuantity
            disabled={!available}
            line={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
              sku: product.sku,
            }}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                `Hola, quiero cotizar: ${product.name}${product.sku ? ` (SKU ${product.sku})` : ""}`,
              )}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              <MessageCircle className="size-4" aria-hidden />
              Consultar por WhatsApp
            </a>
            <a
              href={`mailto:${STORE.email}?subject=${encodeURIComponent(`Consulta: ${product.name}`)}`}
              className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              Consultar por correo
            </a>
          </div>

          {product.description && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-sm font-semibold">Descripción</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {product.description}
              </p>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">
            Productos relacionados
          </h2>
          <ProductGrid products={related} categories={catalog.categories} />
        </section>
      )}
    </div>
  );
}
