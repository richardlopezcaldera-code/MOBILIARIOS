"use client";

import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

import { JUMPSELLER_CART_URL, jumpsellerAddUrl } from "@/lib/store";
import type { CartLine } from "@/lib/cart-context";

const STEP_MS = 1800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Traspasa el carro al checkout de Jumpseller, donde vive la pasarela de pago.
 *
 * La tienda solo acepta un producto por URL (`/cart/add/<id>?qty=N`), así que
 * se abre una ventana y se la navega por cada producto en secuencia. Podemos
 * navegar una ventana que abrimos nosotros aunque sea de otro dominio; lo que
 * no podemos es leerla, por eso el avance va por tiempo y no por evento.
 */
export function PayAtStore({
  lines,
  disabled,
}: {
  lines: CartLine[];
  disabled?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [blocked, setBlocked] = useState(false);

  async function handoff() {
    if (lines.length === 0) return;

    const win = window.open("", "checkout-mobiliariotech", "width=560,height=720");
    if (!win) {
      setBlocked(true);
      return;
    }

    setRunning(true);
    setBlocked(false);
    win.document.write(
      "<title>Preparando tu pedido</title><body style='font:16px system-ui;padding:2rem'>Preparando tu pedido…</body>",
    );

    try {
      for (let index = 0; index < lines.length; index += 1) {
        setStep(index + 1);
        win.location.href = jumpsellerAddUrl(lines[index].id, lines[index].quantity);
        await sleep(STEP_MS);
      }
      win.location.href = JUMPSELLER_CART_URL;
      win.focus();
    } finally {
      setRunning(false);
      setStep(0);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handoff}
        disabled={disabled || running || lines.length === 0}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CreditCard className="size-4" aria-hidden />
        {running
          ? `Preparando ${step} de ${lines.length}…`
          : "Pagar en la tienda"}
      </button>

      <p className="mt-2 text-xs text-muted-foreground">
        Se abre nuestra pasarela de pago segura en una ventana aparte. Los datos
        de tu tarjeta los procesa el banco directamente: nunca pasan por este
        sitio.
      </p>

      {blocked && (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm font-medium">El navegador bloqueó la ventana</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Agrega los productos uno por uno con estos enlaces y luego paga en la
            tienda.
          </p>
          <ol className="mt-3 space-y-1.5">
            {lines.map((line, index) => (
              <li key={line.id} className="text-sm">
                <a
                  href={jumpsellerAddUrl(line.id, line.quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  {index + 1}. {line.quantity} × {line.name}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
