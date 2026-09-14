import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";

import { WholesaleForm } from "@/components/site/wholesale-form";
import { STORE, whatsappLink } from "@/lib/store";
import { getCatalog, rootCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cotización por volumen",
  description:
    "Cotiza mobiliario por volumen para oficinas, colegios, restaurantes e industria.",
};

export default async function WholesalePage() {
  const catalog = await getCatalog();
  const categories = rootCategories(catalog.categories).slice(0, 9);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Cotización por volumen
      </h1>
      <p className="mt-3 text-muted-foreground text-pretty">
        Equipamos oficinas, colegios, restaurantes, clínicas y espacios
        industriales. Cuéntanos qué necesitas y te preparamos una propuesta.
      </p>

      {/* El formulario va primero: es lo único que deja registro de quien
          entra. El WhatsApp y el correo quedan abajo como atajo para quien
          prefiere hablar, pero por ahí el interesado no queda guardado. */}
      <div className="mt-8">
        <WholesaleForm />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={whatsappLink(
            "Hola, necesito una cotización por volumen. Les cuento qué necesito:",
          )}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted"
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

      {/* Umbral y política de precio confirmados por Richard el 13-09-2026:
          desde $1.000.000 se trabaja como mayorista y el precio se cotiza caso
          a caso, sin porcentaje fijo publicado. */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold">Cómo trabajamos el volumen</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Desde <b className="text-foreground">$1.000.000</b> preparamos un
            precio por volumen para su proyecto.
          </li>
          <li>Cada propuesta se cotiza a medida, según cantidad y plazo.</li>
          <li>
            Importación 2 días hábiles · fabricación 5 días hábiles · garantía 6
            meses.
          </li>
          <li>Factura y orden de compra a nombre de su empresa.</li>
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
