"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart, type CartLine } from "@/lib/cart-context";

type Line = Omit<CartLine, "quantity">;

export function AddToCart({
  line,
  disabled,
  withQuantity = false,
  className,
}: {
  line: Line;
  disabled?: boolean;
  withQuantity?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(line, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {withQuantity && (
        <div className="inline-flex h-11 items-center rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Quitar una unidad"
            className="inline-flex size-11 items-center justify-center rounded-l-lg hover:bg-muted disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span
            aria-live="polite"
            className="w-10 text-center text-sm font-medium tabular-nums"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Agregar una unidad"
            className="inline-flex size-11 items-center justify-center rounded-r-lg hover:bg-muted"
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          added
            ? "bg-emerald-600 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {added ? (
          <>
            <Check className="size-4" aria-hidden />
            Agregado
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" aria-hidden />
            {disabled ? "Sin stock" : "Agregar al carro"}
          </>
        )}
      </button>
    </div>
  );
}

/** Variante compacta para las tarjetas de la grilla. */
export function AddToCartCompact({
  line,
  disabled,
}: {
  line: Line;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        add(line, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
      }}
      className={cn(
        "mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        added
          ? "bg-emerald-600 text-white"
          : "border border-border bg-background hover:bg-muted",
      )}
    >
      {added ? (
        <>
          <Check className="size-3.5" aria-hidden />
          Agregado
        </>
      ) : (
        <>
          <ShoppingCart className="size-3.5" aria-hidden />
          {disabled ? "Sin stock" : "Agregar"}
        </>
      )}
    </button>
  );
}
