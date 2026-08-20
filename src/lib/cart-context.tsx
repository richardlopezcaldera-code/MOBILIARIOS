"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export interface CartLine {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  sku: string | null;
  quantity: number;
}

interface Snapshot {
  lines: CartLine[];
  /** false hasta que se leyó localStorage: distingue "vacío" de "aún no sé". */
  loaded: boolean;
}

const STORAGE_KEY = "mobiliariotech.cart.v1";

/**
 * El carro vive fuera de React, en localStorage. Se lee con
 * useSyncExternalStore para que el render del servidor y la hidratación
 * queden consistentes sin setState dentro de un efecto.
 */
const INITIAL: Snapshot = { lines: [], loaded: false };

let snapshot: Snapshot = INITIAL;
const listeners = new Set<() => void>();

function isLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as CartLine;
  return (
    typeof line.id === "number" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.quantity === "number"
  );
}

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isLine) : [];
  } catch {
    return [];
  }
}

function persist(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Almacenamiento lleno o bloqueado: el carro sigue vivo en memoria.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setLines(lines: CartLine[]) {
  snapshot = { lines, loaded: true };
  persist(lines);
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (!snapshot.loaded) {
    // Objeto nuevo siempre: así React re-renderiza aunque el carro esté vacío.
    snapshot = { lines: read(), loaded: true };
  }

  // Mantiene el carro sincronizado entre pestañas.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = { lines: read(), loaded: true };
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => INITIAL;

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCart() {
  const { lines, loaded } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    const existing = snapshot.lines.find((item) => item.id === line.id);
    setLines(
      existing
        ? snapshot.lines.map((item) =>
            item.id === line.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...snapshot.lines, { ...line, quantity }],
    );
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    setLines(
      quantity <= 0
        ? snapshot.lines.filter((item) => item.id !== id)
        : snapshot.lines.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const remove = useCallback((id: number) => {
    setLines(snapshot.lines.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  return useMemo(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const total = lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );
    return {
      lines,
      count,
      total,
      ready: loaded,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, loaded, add, setQuantity, remove, clear]);
}
