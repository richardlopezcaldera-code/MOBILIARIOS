import Link from "next/link";
import { ArrowRight, CloudRain, CloudSun, Cloudy, Snowflake, Sun, Zap } from "lucide-react";

import { findCategory } from "@/lib/data";
import type { Category } from "@/lib/catalog";
import { suggestionFor, type Weather } from "@/lib/weather";

const ICONS = {
  clear: Sun,
  cloudy: Cloudy,
  fog: CloudSun,
  rain: CloudRain,
  snow: Snowflake,
  storm: Zap,
} as const;

export function WeatherBanner({
  weather,
  categories,
}: {
  weather: Weather;
  categories: Category[];
}) {
  const suggestion = suggestionFor(weather);
  const Icon = ICONS[weather.condition];

  const links = suggestion.categorySlugs
    .map((slug) => findCategory(categories, slug))
    .filter((category) => category !== undefined);

  if (links.length === 0) return null;

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Icon className="size-5 text-primary" aria-hidden />
          Santiago, {weather.temperature}°C y {weather.label}
        </p>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{suggestion.headline}</p>
          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {links.map((category) => (
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
      </div>
    </section>
  );
}
