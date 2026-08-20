import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CATALOG_TAG, fetchHooksToken } from "@/lib/jumpseller";

/**
 * Webhook para refrescar el catálogo al instante.
 *
 * Autenticación: Jumpseller firma cada llamada con HMAC-SHA256 sobre el
 * cuerpo, usando el token de webhooks de la tienda, y manda el resultado en
 * la cabecera `Jumpseller-Hmac-Sha256`. Verificamos esa firma contra el token
 * que obtenemos de la propia API con las credenciales ya configuradas.
 *
 * Ventaja: no hay secreto que copiar en dos lados. La URL del webhook puede
 * ser la ruta pelada, sin parámetros.
 *
 * Se mantiene además un modo manual con `?secret=` para poder forzar un
 * refresco a mano, pero solo si REVALIDATE_SECRET está configurado.
 */

const HMAC_HEADER = "jumpseller-hmac-sha256";

/** Comparación en tiempo constante: evita filtrar la firma byte a byte. */
function signatureMatches(expected: string, received: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  // El cuerpo crudo es lo que se firma: no se puede parsear antes.
  const rawBody = await request.text();
  const signature = request.headers.get(HMAC_HEADER);

  if (signature) {
    const token = await fetchHooksToken();
    if (!token) {
      console.error("[revalidate] no se pudo obtener el token de la tienda");
      return NextResponse.json(
        { ok: false, error: "no se pudo verificar la firma" },
        { status: 503 },
      );
    }

    const expected = createHmac("sha256", token)
      .update(rawBody, "utf8")
      .digest("base64");

    if (!signatureMatches(expected, signature)) {
      return NextResponse.json({ ok: false, error: "firma inválida" }, { status: 401 });
    }

    revalidateTag(CATALOG_TAG, { expire: 0 });
    return NextResponse.json({
      ok: true,
      via: "hmac",
      event: request.headers.get("jumpseller-event"),
    });
  }

  // Sin firma: solo se acepta si hay un secreto configurado y coincide.
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "falta la firma de Jumpseller" },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const provided =
    url.searchParams.get("secret") ?? request.headers.get("x-webhook-secret");

  if (provided !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag(CATALOG_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, via: "secret" });
}

/** Permite comprobar desde el navegador que la ruta existe. */
export function GET() {
  return NextResponse.json({
    ok: true,
    hint: "Jumpseller debe llamar esta ruta por POST; la firma se verifica sola.",
  });
}
