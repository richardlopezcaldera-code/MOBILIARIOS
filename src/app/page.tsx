import Link from "next/link";

import { CategoryGrid } from "@/components/site/category-grid";
import { Hero } from "@/components/site/hero";
import { HowToBuy } from "@/components/site/how-to-buy";
import { RotatingRow } from "@/components/site/rotating-row";
import { TrustBar } from "@/components/site/trust-bar";
import { WeatherBanner } from "@/components/site/weather-banner";
import { WholesaleCta } from "@/components/site/wholesale-cta";
import {
  discountedProducts,
  featuredProducts,
  findCategory,
  getCatalog,
  productsInCategory,
  rootCategories,
} from "@/lib/data";
import { getWeather } from "@/lib/weather";

const SHOWCASE = ["escritorios", "sillas", "mesas", "lockers", "estantes-y-repisas"];

export default async function Home() {
  const [catalog, weather] = await Promise.all([getCatalog(), getWeather()]);
  const roots = rootCategories(catalog.categories);

  // Foto real de producto para cada tarjeta de categoria, en vez de un icono.
  // No sirve tomar el primero: hay productos mal categorizados (un escritorio
  // dentro de Estantes) y fotos que son capturas de pantalla. Se exige que el
  // NOMBRE del producto empiece por la palabra de la linea.
  const CLAVE: Record<string, string[]> = {
    sillas: ["silla"],
    mesas: ["mesa"],
    escritorios: ["escritorio"],
    "estantes-y-repisas": ["estante", "repisa", "biblioteca"],
    lockers: ["locker", "casillero"],
    "pizarras-y-murales": ["pizarra", "mural", "diario mural"],
  };
  const sinAcentos = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const fotoUtil = (u: string) =>
    u.startsWith("https://images.jumpseller.com/") &&
    !/captura|screenshot|whatsapp/i.test(u);

  // Entre los que calzan, preferir el que represente la venta corporativa:
  // esta es una tienda de oficina, no de mobiliario escolar.
  const PREFIERE: Record<string, RegExp> = {
    sillas: /ejecutiv|ergonom|gerencial|malla|oficina/,
    mesas: /reunion|conferenc|directorio|oficina/,
    escritorios: /recto|estacion|gerencia|oficina/,
    "estantes-y-repisas": /biblioteca|archivo|oficina/,
    lockers: /locker/,
    "pizarras-y-murales": /pizarra|mural/,
  };
  const EVITA = /escolar|universitari|jardin|infantil/;

  const fotoPorCategoria: Record<string, string> = {};
  for (const c of roots.slice(0, 6)) {
    const claves = CLAVE[c.slug] ?? [sinAcentos(c.name).split(" ")[0]];
    const items = productsInCategory(catalog, c).filter((p) =>
      (p.images || []).some(fotoUtil),
    );
    const calza = items.filter((p) =>
      claves.some((k) => sinAcentos(p.name).startsWith(k)),
    );
    const base = calza.length > 0 ? calza : items;
    const corporativo = base.filter(
      (p) =>
        !EVITA.test(sinAcentos(p.name)) &&
        (PREFIERE[c.slug]?.test(sinAcentos(p.name)) ?? true),
    );
    const pool = corporativo.length > 0 ? corporativo : base;
    const elegido = pool.find((p) => p.featured) ?? pool[0];
    const foto = elegido?.images.find(fotoUtil);
    if (foto) fotoPorCategoria[c.slug] = foto;
  }

  const offers = discountedProducts(catalog.products, 40);
  const featured = featuredProducts(catalog.products, 40);

  const rows = SHOWCASE.map((slug) => {
    const category = findCategory(catalog.categories, slug);
    if (!category) return null;
    return { category, items: productsInCategory(catalog, category).slice(0, 60) };
  }).filter((row) => row !== null);

  return (
    <>
      <Hero total={catalog.products.length} categories={roots} />

      <TrustBar />

      <CategoryGrid
        categories={roots}
        total={roots.length}
        fotos={fotoPorCategoria}
      />

      <HowToBuy />

      {weather && (
        <WeatherBanner weather={weather} categories={catalog.categories} />
      )}

      {offers.length > 0 && (
        <RotatingRow
          title="Ofertas vigentes"
          subtitle="Productos con precio rebajado en el catálogo"
          products={offers}
          href="/categoria/ofertas-del-dia"
        />
      )}

      {featured.length > 0 && (
        <RotatingRow
          title="Destacados"
          subtitle="Seleccionados desde tu catálogo"
          products={featured}
          href="/buscar"
        />
      )}

      {rows.map(({ category, items }) => (
        <RotatingRow
          key={category.id}
          title={category.name}
          subtitle={`${category.count} productos disponibles`}
          products={items}
          href={`/categoria/${category.slug}`}
        />
      ))}

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl">
          Todas las categorías
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {roots.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categoria/${category.slug}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary hover:bg-muted/50"
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WholesaleCta />
    </>
  );
}
