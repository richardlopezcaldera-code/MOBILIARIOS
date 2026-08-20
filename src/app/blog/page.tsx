import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";

import { articles, sortForWeather } from "@/data/blog";
import { getWeather } from "@/lib/weather";

export const metadata: Metadata = {
  title: "Recomendaciones",
  description:
    "Guías prácticas para elegir mobiliario de oficina, hogar y exterior.",
};

export default async function BlogPage() {
  const weather = await getWeather();
  const ordered = sortForWeather(
    weather?.condition ?? null,
    weather?.temperature ?? null,
  );
  const [first, ...rest] = ordered;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Recomendaciones
      </h1>
      <p className="mt-2 text-muted-foreground">
        {weather
          ? `Hoy en Santiago: ${weather.temperature}°C y ${weather.label}. Ordenamos las guías según eso.`
          : "Guías prácticas para elegir bien antes de comprar."}
      </p>

      <article className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs font-medium text-primary">
          {weather ? "Recomendado para hoy" : "Destacado"}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <Link href={`/blog/${first.slug}`} className="hover:underline">
            {first.title}
          </Link>
        </h2>
        <p className="mt-2 text-muted-foreground text-pretty">{first.summary}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          {first.readingMinutes} min de lectura
        </p>
      </article>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {rest.map((article) => (
          <li
            key={article.slug}
            className="mt-rise rounded-xl border border-border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0"
          >
            <h2 className="text-base font-semibold tracking-tight">
              <Link href={`/blog/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              {article.summary}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {article.readingMinutes} min
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        {articles.length} guías publicadas.
      </p>
    </div>
  );
}
