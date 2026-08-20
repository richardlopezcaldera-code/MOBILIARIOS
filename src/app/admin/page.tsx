"use client";

import { useMemo, useState } from "react";
import { Download, FileWarning, Plus, RotateCcw, Trash2 } from "lucide-react";

import { formatCLP } from "@/lib/store";
import { products } from "@/lib/catalog";
import {
  currentValue,
  download,
  draftsToCsv,
  useDrafts,
  type EditableFields,
} from "@/lib/drafts";

const PER_PAGE = 20;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function AdminPage() {
  const drafts = useDrafts();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return products;
    return products.filter((product) => {
      const haystack = normalize(`${product.name} ${product.sku ?? ""}`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const field =
    "h-9 w-full rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Panel de productos
      </h1>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--offer)]/40 bg-[var(--offer)]/5 p-4">
        <FileWarning
          className="mt-0.5 size-5 shrink-0 text-[var(--offer)]"
          aria-hidden
        />
        <div className="text-sm">
          <p className="font-medium">Modo borrador — no toca tu tienda</p>
          <p className="mt-1 text-muted-foreground">
            Los cambios se guardan solo en este navegador. Nada se escribe en
            Jumpseller. Cuando estés conforme, exporta el archivo y aplícalo tú.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nombre o SKU…"
          aria-label="Buscar productos"
          className="h-10 min-w-64 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
        <button
          type="button"
          onClick={drafts.create}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          <Plus className="size-4" aria-hidden />
          Producto nuevo
        </button>
        <button
          type="button"
          disabled={drafts.total === 0}
          onClick={() =>
            download(
              "cambios-mobiliariotech.csv",
              draftsToCsv(drafts),
              "text/csv;charset=utf-8",
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-4" aria-hidden />
          Exportar CSV ({drafts.total})
        </button>
        {drafts.total > 0 && (
          <button
            type="button"
            onClick={drafts.clearAll}
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:text-destructive"
          >
            Descartar todo
          </button>
        )}
      </div>

      {drafts.created.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold">
            Productos nuevos ({drafts.created.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {drafts.created.map((item) => (
              <li
                key={item.tempId}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Nombre</span>
                    <input
                      value={item.name}
                      onChange={(e) =>
                        drafts.editNew(item.tempId, "name", e.target.value)
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">SKU</span>
                    <input
                      value={item.sku}
                      onChange={(e) =>
                        drafts.editNew(item.tempId, "sku", e.target.value)
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">
                      Precio neto
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={item.price}
                      onChange={(e) =>
                        drafts.editNew(
                          item.tempId,
                          "price",
                          Number(e.target.value),
                        )
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Stock</span>
                    <input
                      type="number"
                      min={0}
                      value={item.stock}
                      onChange={(e) =>
                        drafts.editNew(
                          item.tempId,
                          "stock",
                          Number(e.target.value),
                        )
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => drafts.removeNew(item.tempId)}
                    aria-label="Eliminar producto nuevo"
                    className="mt-5 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <p className="text-sm text-muted-foreground">
          {filtered.length} productos · {drafts.editedCount} con cambios
        </p>

        <ul className="mt-3 space-y-3">
          {visible.map((product) => {
            const changed = drafts.edits[product.id] !== undefined;
            const get = <K extends keyof EditableFields>(key: K) =>
              currentValue(product, key, drafts.edits);

            return (
              <li
                key={product.id}
                className={`rounded-xl border bg-card p-4 ${
                  changed ? "border-primary" : "border-border"
                }`}
              >
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Nombre</span>
                    <input
                      value={get("name")}
                      onChange={(e) =>
                        drafts.edit(product.id, "name", e.target.value)
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">
                      Precio neto — actual {formatCLP(product.price)}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={get("price")}
                      onChange={(e) =>
                        drafts.edit(product.id, "price", Number(e.target.value))
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">
                      Stock — actual {product.stock}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={get("stock")}
                      onChange={(e) =>
                        drafts.edit(product.id, "stock", Number(e.target.value))
                      }
                      className={`mt-1 ${field}`}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => drafts.revert(product.id)}
                    disabled={!changed}
                    aria-label="Descartar cambios de este producto"
                    className="mt-5 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {totalPages > 1 && (
          <nav
            aria-label="Paginación"
            className="mt-6 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current <= 1}
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm hover:bg-muted disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-3 text-sm text-muted-foreground">
              {current} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current >= totalPages}
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm hover:bg-muted disabled:opacity-40"
            >
              Siguiente
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
