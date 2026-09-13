import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";

import { ProductGrid } from "@/components/site/product-row";
import {
  ArticleSchema,
  BreadcrumbSchema,
} from "@/components/site/structured-data";
import { articleBySlug, articles } from "@/data/blog";
import { findCategory, getCatalog, productsInCategory } from "@/lib/data";
import { whatsappLink } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/blog/${article.slug}` },
  };
}

/** Convierte **negrita** en <strong>. No se admite más marcado que ese. */
function renderParagraph(text: string, key: number) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={key} className="mt-4 leading-relaxed text-pretty">
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const catalog = await getCatalog();
  const categories = article.categorySlugs
    .map((categorySlug) => findCategory(catalog.categories, categorySlug))
    .filter((category) => category !== undefined);

  const picks = categories
    .flatMap((category) => productsInCategory(catalog, category).slice(0, 4))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <ArticleSchema
        title={article.title}
        summary={article.summary}
        slug={article.slug}
      />
      <BreadcrumbSchema
        trail={[
          { name: "Inicio", path: "/" },
          { name: "Recomendaciones", path: "/blog" },
          { name: article.title, path: `/blog/${article.slug}` },
        ]}
      />
      <nav aria-label="Ruta" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        {" / "}
        <Link href="/blog" className="hover:text-foreground">
          Recomendaciones
        </Link>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground text-pretty">
        {article.summary}
      </p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" aria-hidden />
        {article.readingMinutes} min de lectura
      </p>

      <div className="mt-8 text-muted-foreground">
        {article.body.map((paragraph, index) =>
          renderParagraph(paragraph, index),
        )}
      </div>

      {categories.length > 0 && (
        <section className="mt-10 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Categorías de este artículo</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:bg-muted"
                >
                  {category.name}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {picks.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-lg font-semibold tracking-tight">
            Del catálogo
          </h2>
          <ProductGrid products={picks} categories={catalog.categories} />
        </section>
      )}

      <section className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="text-base font-semibold">¿Dudas antes de decidir?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cuéntanos el espacio que quieres equipar y te orientamos.
        </p>
        <a
          href={whatsappLink(`Hola, leí "${article.title}" y tengo una consulta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <MessageCircle className="size-4" aria-hidden />
          Consultar por WhatsApp
        </a>
      </section>
    </div>
  );
}
