import { FileText, ShieldCheck, Truck, Wallet } from "lucide-react";

/**
 * Cada afirmación aquí es verificable con los datos de la tienda.
 * No agregar promesas (envío gratis, plazos, garantías) sin confirmarlas.
 * Plazos, garantía y política de precio confirmados por Richard el 13-09-2026.
 */
const ITEMS = [
  {
    icon: FileText,
    title: "Factura y orden de compra",
    detail: "Documentación tributaria para el área de finanzas.",
  },
  {
    icon: Truck,
    title: "Importación 2 días · fabricación 5 días",
    detail: "Días hábiles. Despacho a todo Chile o retiro en tienda.",
  },
  {
    icon: Wallet,
    title: "Precio de catálogo",
    detail: "Los mismos precios publicados, en cotización formal.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía 6 meses",
    detail: "En todo el catálogo, con respaldo de repuestos.",
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
