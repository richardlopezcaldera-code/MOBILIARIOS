"use client";

import {
  useOptionalFeature,
  usePrefersReducedMotion,
} from "@/lib/client-preferences";
import type { Condition } from "@/lib/weather";

const STORAGE_KEY = "mobiliariotech.weather-fx";

/**
 * Efecto ambiental según el clima real.
 *
 * Reglas que se respetan a propósito:
 * - `prefers-reduced-motion` lo desactiva por completo.
 * - Es `pointer-events: none`, nunca bloquea un clic.
 * - Se puede apagar y la preferencia queda guardada.
 * - Opacidad baja y pocas partículas: en una tienda, el producto manda.
 */
export function WeatherEffect({ condition }: { condition: Condition }) {
  const [enabled, disable] = useOptionalFeature(STORAGE_KEY);
  const reducedMotion = usePrefersReducedMotion();

  if (!enabled || reducedMotion) return null;
  if (condition !== "rain" && condition !== "storm" && condition !== "snow") {
    return null;
  }

  const isSnow = condition === "snow";
  const drops = Array.from({ length: isSnow ? 26 : 34 }, (_, index) => {
    // Determinista: mismo resultado en servidor y cliente, sin Math.random.
    const left = (index * 37) % 100;
    const delay = ((index * 13) % 40) / 10;
    const duration = isSnow ? 6 + ((index * 7) % 5) : 0.9 + ((index * 3) % 7) / 10;
    return { left, delay, duration, index };
  });

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      >
        {drops.map((drop) => (
          <span
            key={drop.index}
            className={isSnow ? "mt-snow" : "mt-drop"}
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={disable}
        className="fixed bottom-4 left-4 z-50 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur hover:text-foreground"
      >
        Desactivar efecto
      </button>
    </>
  );
}
