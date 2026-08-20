import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/store";
import { AddToCartCompact } from "@/components/site/add-to-cart";
import { discountPercent, inStock, type Product } from "@/lib/catalog";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const discount = discountPercent(product);
  const available = inStock(product);
  const [primary, secondary] = product.images;

  return (
    <div
      className={cn(
        "group mt-rise flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="flex flex-1 flex-col"
        tabIndex={0}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={primary}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={cn(
              "object-contain p-3 transition-[opacity,transform] duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100",
              secondary && "group-hover:opacity-0",
            )}
          />
          {secondary && (
            <Image
              src={secondary}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 motion-reduce:group-hover:scale-100"
            />
          )}
          {discount !== null && (
            <span className="absolute top-2 left-2 rounded-md bg-[var(--offer)] px-2 py-1 text-xs font-semibold text-white transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
              -{discount}%
            </span>
          )}
          {!available && (
            <span className="absolute top-2 right-2 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
              Agotado
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3 pb-0">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:underline">
            {product.name}
          </h3>
          {product.sku && (
            <p className="text-xs text-muted-foreground">SKU {product.sku}</p>
          )}
          <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
            <span className="text-base font-semibold text-foreground">
              {formatCLP(product.price)}
            </span>
            {discount !== null && product.compareAt && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCLP(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <AddToCartCompact
          line={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: primary,
            sku: product.sku,
          }}
          disabled={!available}
        />
      </div>
    </div>
  );
}
