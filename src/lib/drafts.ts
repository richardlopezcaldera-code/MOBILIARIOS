"use client";

import { useCallback, useSyncExternalStore } from "react";

import { products, type Product } from "@/lib/catalog";

export interface EditableFields {
  name: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
}

export interface DraftState {
  /** Cambios sobre productos existentes, indexados por id. */
  edits: Record<string, Partial<EditableFields>>;
  /** Productos nuevos, todavía sin existir en Jumpseller. */
  created: (EditableFields & { tempId: string })[];
}

const STORAGE_KEY = "mobiliariotech.drafts.v1";
const INITIAL: DraftState = { edits: {}, created: [] };

let snapshot: DraftState = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function read(): DraftState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { edits: {}, created: [] };
    const parsed = JSON.parse(raw) as Partial<DraftState>;
    return {
      edits: typeof parsed.edits === "object" && parsed.edits ? parsed.edits : {},
      created: Array.isArray(parsed.created) ? parsed.created : [],
    };
  } catch {
    return { edits: {}, created: [] };
  }
}

function commit(next: DraftState) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sin espacio: el borrador sigue en memoria hasta recargar.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    snapshot = read();
  }
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => INITIAL;

export function useDrafts() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const edit = useCallback(
    (id: number, field: keyof EditableFields, value: string | number) => {
      commit({
        ...snapshot,
        edits: {
          ...snapshot.edits,
          [id]: { ...snapshot.edits[id], [field]: value },
        },
      });
    },
    [],
  );

  const revert = useCallback((id: number) => {
    const edits = { ...snapshot.edits };
    delete edits[String(id)];
    commit({ ...snapshot, edits });
  }, []);

  const create = useCallback(() => {
    const tempId = `nuevo-${snapshot.created.length + 1}-${String(
      Object.keys(snapshot.edits).length,
    )}`;
    commit({
      ...snapshot,
      created: [
        ...snapshot.created,
        { tempId, name: "", price: 0, stock: 0, sku: "", description: "" },
      ],
    });
  }, []);

  const editNew = useCallback(
    (tempId: string, field: keyof EditableFields, value: string | number) => {
      commit({
        ...snapshot,
        created: snapshot.created.map((item) =>
          item.tempId === tempId ? { ...item, [field]: value } : item,
        ),
      });
    },
    [],
  );

  const removeNew = useCallback((tempId: string) => {
    commit({
      ...snapshot,
      created: snapshot.created.filter((item) => item.tempId !== tempId),
    });
  }, []);

  const clearAll = useCallback(() => commit({ edits: {}, created: [] }), []);

  const editedCount = Object.keys(state.edits).length;

  return {
    ...state,
    editedCount,
    total: editedCount + state.created.length,
    edit,
    revert,
    create,
    editNew,
    removeNew,
    clearAll,
  };
}

/** Valor actual de un campo: el del borrador si existe, si no el del catálogo. */
export function currentValue<K extends keyof EditableFields>(
  product: Product,
  field: K,
  edits: Record<string, Partial<EditableFields>>,
): EditableFields[K] {
  const draft = edits[product.id]?.[field];
  if (draft !== undefined) return draft as EditableFields[K];
  const fallback: EditableFields = {
    name: product.name,
    price: product.price,
    stock: product.stock,
    sku: product.sku ?? "",
    description: product.description,
  };
  return fallback[field];
}

function csvCell(value: string | number): string {
  const text = String(value).replace(/"/g, '""');
  return /[",\n;]/.test(text) ? `"${text}"` : text;
}

/** CSV con los cambios, listo para revisar o importar a mano en Jumpseller. */
export function draftsToCsv(state: DraftState): string {
  const header = [
    "accion",
    "id",
    "sku",
    "nombre",
    "precio_neto",
    "stock",
    "descripcion",
  ];
  const rows: string[][] = [];

  for (const [id, changes] of Object.entries(state.edits)) {
    const product = products.find((item) => item.id === Number(id));
    if (!product) continue;
    rows.push([
      "editar",
      id,
      String(changes.sku ?? product.sku ?? ""),
      String(changes.name ?? product.name),
      String(changes.price ?? product.price),
      String(changes.stock ?? product.stock),
      String(changes.description ?? product.description),
    ]);
  }

  for (const item of state.created) {
    rows.push([
      "crear",
      "",
      item.sku,
      item.name,
      String(item.price),
      String(item.stock),
      item.description,
    ]);
  }

  return [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
}

export function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
