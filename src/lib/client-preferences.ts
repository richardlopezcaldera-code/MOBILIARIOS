"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Preferencias que solo existen en el navegador (matchMedia, localStorage).
 *
 * Se leen con useSyncExternalStore en vez de un efecto con setState: así el
 * render del servidor y la hidratación quedan consistentes sin trucos.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeMotion(listener: () => void): () => void {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    // En el servidor no se puede saber: se asume que sí hay movimiento.
    // El CSS igual desactiva las animaciones vía media query.
    () => false,
  );
}

// --- Interruptor guardado en localStorage --------------------------------

const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, boolean>();

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) !== "off";
  } catch {
    return true;
  }
}

function subscribeFlag(key: string) {
  return (listener: () => void): (() => void) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    if (!cache.has(key)) cache.set(key, read(key));
    return () => {
      listeners.get(key)?.delete(listener);
    };
  };
}

/**
 * Devuelve si una función opcional está activa, y cómo apagarla.
 * Arranca en `false` durante el render del servidor para no mostrar nada
 * antes de saber la preferencia real del visitante.
 */
export function useOptionalFeature(key: string): [boolean, () => void] {
  const enabled = useSyncExternalStore(
    subscribeFlag(key),
    () => cache.get(key) ?? read(key),
    () => false,
  );

  const disable = useCallback(() => {
    try {
      window.localStorage.setItem(key, "off");
    } catch {
      // Sin almacenamiento: se apaga solo por esta sesión.
    }
    cache.set(key, false);
    for (const listener of listeners.get(key) ?? []) listener();
  }, [key]);

  return [enabled, disable];
}
