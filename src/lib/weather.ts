import "server-only";

import { STORE } from "@/lib/store";

/**
 * Clima actual en Santiago vía Open-Meteo.
 *
 * No necesita credenciales. Si la API falla, `getWeather()` devuelve null y
 * el sitio simplemente no muestra nada relacionado al clima — nunca se cae
 * ni inventa una condición.
 */

export type Condition = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export interface Weather {
  temperature: number;
  condition: Condition;
  isDay: boolean;
  /** mm de precipitación en el intervalo actual */
  precipitation: number;
  label: string;
}

/** Códigos WMO → condición. https://open-meteo.com/en/docs */
function toCondition(code: number): Condition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

const LABELS: Record<Condition, string> = {
  clear: "despejado",
  cloudy: "nublado",
  fog: "con niebla",
  rain: "lloviendo",
  snow: "nevando",
  storm: "con tormenta",
};

interface ApiResponse {
  current?: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
    precipitation: number;
  };
}

export async function getWeather(): Promise<Weather | null> {
  const params = new URLSearchParams({
    latitude: String(STORE.address.latitude),
    longitude: String(STORE.address.longitude),
    current: "temperature_2m,weather_code,is_day,precipitation",
    timezone: "America/Santiago",
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      {
        // La API actualiza cada 15 min; no tiene sentido pedir más seguido.
        next: { revalidate: 900 },
        // Sin este límite, una API lenta congela el render de TODAS las
        // páginas: el clima se consulta desde el layout.
        signal: AbortSignal.timeout(3000),
      },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as ApiResponse;
    if (!data.current) return null;

    const condition = toCondition(data.current.weather_code);
    return {
      temperature: Math.round(data.current.temperature_2m),
      condition,
      isDay: data.current.is_day === 1,
      precipitation: data.current.precipitation,
      label: LABELS[condition],
    };
  } catch {
    return null;
  }
}

/**
 * Qué conviene mostrar según el clima. Las categorías son las reales de la
 * tienda; si alguna no existe, el componente simplemente la omite.
 */
export interface Suggestion {
  headline: string;
  reason: string;
  categorySlugs: string[];
}

export function suggestionFor(weather: Weather): Suggestion {
  const { condition, temperature } = weather;

  if (condition === "rain" || condition === "storm") {
    return {
      headline: "Días de lluvia, más horas puertas adentro",
      reason:
        "Con este clima el living y el escritorio se usan el doble. Estos son los que más salen.",
      categorySlugs: ["sofas-y-living", "escritorios", "comedor-y-muebles-varios"],
    };
  }

  if (condition === "snow" || temperature <= 8) {
    return {
      headline: "Hace frío en Santiago",
      reason:
        "Para armar un rincón abrigado donde pasar la tarde sin salir.",
      categorySlugs: ["sofas-y-living", "comedor-y-muebles-varios", "estantes-y-repisas"],
    };
  }

  if (condition === "clear" && temperature >= 24) {
    return {
      headline: "Buen día para estar afuera",
      reason:
        "Terraza, patio y quincho: lo que necesitas para aprovechar el calor.",
      categorySlugs: ["parrillas-y-exterior", "mesas/mesas-plegables", "ping-pong-y-juegos"],
    };
  }

  if (condition === "clear") {
    return {
      headline: "Día despejado",
      reason: "Buen momento para renovar el espacio de trabajo con luz natural.",
      categorySlugs: ["escritorios", "sillas/sillas-ejecutivas-y-ergonomicas"],
    };
  }

  return {
    headline: "Para equipar la oficina",
    reason: "Lo más pedido para espacios de trabajo, llueva o truene.",
    categorySlugs: ["escritorios", "sillas", "estantes-y-repisas"],
  };
}
