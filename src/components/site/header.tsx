import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Truck } from "lucide-react";

import { CartBadge } from "@/components/site/cart-badge";
import { STORE } from "@/lib/store";
import { childrenOf, getCatalog, rootCategories } from "@/lib/data";

export async function Header() {
  const { categories } = await getCatalog();
  const roots = rootCategories(categories);
  const primary = roots.slice(0, 8);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
          <Truck className="size-4 shrink-0" aria-hidden />
          {/* TODO: confirmar zonas y costos de despacho antes de publicar. */}
          <p>
            Retiro en {STORE.address.street}, {STORE.address.city} · Consultas al{" "}
            {STORE.whatsappDisplay}
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/emblema-mtc.png"
            alt="Mobiliarios Tech Chile"
            width={480}
            height={480}
            priority
            className="size-9 shrink-0 sm:size-10"
          />
          <span className="text-lg leading-none font-bold tracking-tight">
            Mobiliarios <span className="text-primary">Tech</span>
          </span>
        </Link>

        <form
          action="/buscar"
          className="relative hidden flex-1 items-center md:flex"
          role="search"
        >
          <Search
            className="absolute left-3 size-4 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            name="q"
            placeholder="Buscar escritorios, sillas, mesas…"
            aria-label="Buscar productos"
            className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted md:hidden"
          >
            <Search className="size-5" />
          </Link>
          <CartBadge />
        </div>
      </div>

      <nav aria-label="Categorías" className="border-t border-border">
        <div className="mx-auto hidden max-w-7xl items-center gap-1 px-4 lg:flex">
          {primary.map((category) => {
            const subs = childrenOf(categories, category.id);
            return (
              <div key={category.id} className="group relative">
                <Link
                  href={`/categoria/${category.slug}`}
                  className="inline-flex h-11 items-center px-3 text-sm font-medium hover:text-primary"
                >
                  {category.name}
                </Link>
                {subs.length > 0 && (
                  <div className="invisible absolute top-full left-0 z-50 min-w-56 rounded-b-xl border border-border bg-background p-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {subs.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categoria/${sub.slug}`}
                        className="flex items-center justify-between gap-4 rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        <span>{sub.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {sub.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <details className="lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium">
            <Menu className="size-4" aria-hidden />
            Categorías
          </summary>
          <ul className="border-t border-border px-2 pb-3">
            {roots.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </nav>
    </header>
  );
}
