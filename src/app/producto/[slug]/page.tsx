import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, X } from "lucide-react";

import { AddToCart } from "@/components/site/add-to-cart";
import { ProductGrid } from "@/components/site/product-row";
import { STORE, formatCLP, whatsappLink } from "@/lib/store";
import {
  discountPercent,
  getCategoryById,
  getProduct,
  inStock,
  relatedProducts,
} from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    // Solo el nombre: el template del layout ya agrega "| MobiliarioTech".
    title: product.name,
    description: product.excerpt || undefined,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const discount = discountPercent(product);
  const available = inStock(product);
  const related = relatedProducts(product);
  const categories = product.categories
    .map((id) => getCategoryById(id))
    .filter((c) => c !== undefined);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Ruta" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        {categories[0] && (
          <>
            {" / "}
            <Link
              href={`/categoria/${categories[0].slug}`}
              className="hover:text-foreground"
            >
              {categories[0].name}
            </Link>
          </>
        )}
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
                <span className="rounded-md bg-[var(--offer)] px-2 py-1 text-xs font-semibold text-white">
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
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
