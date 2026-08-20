import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CATALOG_TAG } from "@/lib/jumpseller";

/**
 * Webhook para refrescar el catálogo al instante.
 *
 * Se configura en Jumpseller (Configuración → Webhooks) apuntando a:
 *   https://TU-DOMINIO/api/revalidate?secret=EL_SECRETO
 *
 * Sin el secreto correcto responde 401: si no, cualquiera podría forzar
 * recargas del catálogo contra la API y agotar el límite de solicitudes.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET no está configurado" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const provided =
    url.searchParams.get("secret") ?? request.headers.get("x-webhook-secret");

  if (provided !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // `{ expire: 0 }` vence el caché de inmediato: la siguiente visita espera
  // los datos frescos. Con el perfil "max" se serviría el precio viejo una
  // vez más mientras refresca por detrás, y en una tienda eso no sirve.
  // `updateTag` sería lo ideal, pero Next 16 solo lo permite en Server Actions.
  revalidateTag(CATALOG_TAG, { expire: 0 });

  return NextResponse.json({ ok: true, revalidated: CATALOG_TAG });
}

/** Permite comprobar desde el navegador que la ruta existe. */
export function GET() {
  return NextResponse.json({
    ok: true,
    hint: "Usa POST con ?secret=... para refrescar el catálogo.",
  });
}
