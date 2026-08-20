import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { STORE, whatsappLink } from "@/lib/store";
import { rootCategories } from "@/lib/catalog";

export function Footer() {
  const roots = rootCategories().slice(0, 8);

  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold tracking-tight">
            Mobiliario<span className="text-primary">Tech</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
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
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contacto</h2>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={whatsappLink("Hola, tengo una consulta sobre un producto.")}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden />
                {STORE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${STORE.email}`}
                className="flex items-center gap-2 hover:text-foreground"
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
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/mayoristas" className="hover:text-foreground">
                Cotización por volumen
              </Link>
            </li>
            <li>
              <Link href="/buscar" className="hover:text-foreground">
                Buscar en el catálogo
              </Link>
            </li>
            <li>
              <a href={STORE.url} className="hover:text-foreground">
                Tienda actual
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {STORE.legalName}. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
