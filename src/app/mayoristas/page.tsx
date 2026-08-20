import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";

import { STORE, whatsappLink } from "@/lib/store";
import { rootCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cotización por volumen | MobiliarioTech",
  description:
    "Cotiza mobiliario por volumen para oficinas, colegios, restaurantes e industria.",
};

export default function WholesalePage() {
  const categories = rootCategories().slice(0, 9);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Cotización por volumen
      </h1>
      <p className="mt-3 text-muted-foreground text-pretty">
        Equipamos oficinas, colegios, restaurantes, clínicas y espacios
        industriales. Cuéntanos qué necesitas y te preparamos una propuesta.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={whatsappLink(
            "Hola, necesito una cotización por volumen. Les cuento qué necesito:",
          )}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <MessageCircle className="size-4" aria-hidden />
          Escribir por WhatsApp
        </a>
        <a
          href={`mailto:${STORE.email}?subject=${encodeURIComponent("Cotización por volumen")}`}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted"
        >
          <Mail className="size-4" aria-hidden />
          {STORE.email}
        </a>
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-semibold">Qué incluir en tu consulta</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Tipo de mobiliario y cantidad estimada</li>
          <li>Ciudad o comuna de entrega</li>
          <li>Plazo en que lo necesitas</li>
          <li>Si requieres factura</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Líneas disponibles</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {category.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
