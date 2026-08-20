import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { STORE, whatsappLink } from "@/lib/store";
import { getCatalog, rootCategories } from "@/lib/data";

/**
 * Medios de pago que la tienda ya tiene habilitados en Jumpseller.
 * Los logos se sirven desde el CDN de Jumpseller, los mismos que muestra
 * mobiliariostechchile.cl. No agregar aquí un medio que no esté activo.
 */
const PAYMENTS = [
  {
    name: "Mercado Pago (crédito, débito, prepago, transferencia)",
    src: "https://assets.jumpseller.com/public/payment-logos/mercadopago.svg",
  },
  {
    name: "Flow",
    src: "https://assets.jumpseller.com/public/payment-logos/flow.svg",
  },
  {
    name: "Transferencia Bancaria",
    src: "https://assets.jumpseller.com/public/payment-logos/manual.svg",
  },
  {
    name: "Oneclick",
    src: "https://assets.jumpseller.com/public/payment-logos/oneclick.svg",
  },
];

export async function Footer() {
  const { categories } = await getCatalog();
  const roots = rootCategories(categories).slice(0, 8);

  return (
    <footer className="mt-16 border-t border-border bg-muted/30 text-royal">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold tracking-tight">
            Mobiliario<span className="text-primary">Tech</span>
          </p>
          <p className="mt-2 text-sm">
            Mobiliario para oficina, hogar, gastronomía e industria.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Categorías</h2>
          <ul className="mt-3 space-y-2">
            {roots.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="text-sm hover:underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contacto</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a
                href={whatsappLink("Hola, tengo una consulta sobre un producto.")}
                className="flex items-center gap-2 hover:underline"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden />
                {STORE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${STORE.email}`}
                className="flex items-center gap-2 hover:underline"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                {STORE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {STORE.address.street}, {STORE.address.city}
                <br />
                {STORE.address.region}, {STORE.address.country}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Empresas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/mayoristas" className="hover:underline">
                Cotización por volumen
              </Link>
            </li>
            <li>
              <Link href="/buscar" className="hover:underline">
                Buscar en el catálogo
              </Link>
            </li>
            <li>
              <a href={STORE.url} className="hover:underline">
                Tienda actual
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="text-sm font-semibold">Medios de pago</h2>
          <ul className="mt-4 flex flex-wrap items-center gap-3">
            {PAYMENTS.map((payment) => (
              <li
                key={payment.name}
                className="flex h-16 w-28 items-center justify-center rounded-lg border border-border bg-background p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payment.src}
                  alt={payment.name}
                  width={96}
                  height={40}
                  loading="lazy"
                  className="max-h-10 w-auto object-contain"
                />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs">
            El pago se procesa en {STORE.url.replace("https://", "")}.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs">
          © {new Date().getFullYear()} {STORE.legalName}. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
