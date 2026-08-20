import { MessageCircle } from "lucide-react";

import { STORE, whatsappLink } from "@/lib/store";

export function WholesaleCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            ¿Necesitas equipar una oficina completa?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Cuéntanos qué necesitas y te preparamos una cotización por volumen.
            Atendemos empresas, colegios, restaurantes y oficinas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                "Hola, necesito una cotización por volumen para equipar un espacio.",
              )}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <MessageCircle className="size-4" aria-hidden />
              Escribir por WhatsApp
            </a>
            <a
              href={`mailto:${STORE.email}?subject=${encodeURIComponent("Cotización por volumen")}`}
              className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              Enviar correo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
