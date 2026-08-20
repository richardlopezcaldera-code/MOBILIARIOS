import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/store";
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
    <Link
      href={`/producto/${product.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={primary}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={cn(
            "object-contain p-3 transition-opacity duration-300",
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
            className="object-contain p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {discount !== null && (
          <span className="absolute top-2 left-2 rounded-md bg-[var(--offer)] px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
        {!available && (
          <span className="absolute top-2 right-2 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
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
        <span className="text-xs font-medium text-primary">
          {product.variants > 0 ? "Ver opciones" : "Ver producto"}
        </span>
      </div>
    </Link>
  );
}
