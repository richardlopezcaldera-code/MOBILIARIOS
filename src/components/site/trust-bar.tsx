import { Building2, MapPin, MessageCircle, PackageSearch } from "lucide-react";

import { STORE } from "@/lib/store";

/**
 * Cada afirmación aquí es verificable con los datos de la tienda.
 * No agregar promesas (envío gratis, plazos, garantías) sin confirmarlas.
 */
const ITEMS = [
  {
    icon: MapPin,
    title: "Retiro en tienda",
    detail: `${STORE.address.street}, ${STORE.address.city}`,
  },
  {
    icon: MessageCircle,
    title: "Atención por WhatsApp",
    detail: STORE.whatsappDisplay,
  },
  {
    icon: Building2,
    title: "Venta a empresas",
    detail: "Cotización por volumen",
  },
  {
    icon: PackageSearch,
    title: "Catálogo amplio",
    detail: "Oficina, hogar, gastronomía e industria",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30">
      <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
