"use client";

import { useState } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";

import { PLAZOS, RUBROS, TRAMOS, enviarLead } from "@/lib/leads";
import { whatsappLink } from "@/lib/store";

const campo =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";
const etiqueta = "mb-1.5 block text-sm font-medium";

export function WholesaleForm() {
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const datos = new FormData(evento.currentTarget);
    const texto = (clave: string) => String(datos.get(clave) ?? "").trim();
    const numero = (clave: string) => {
      const bruto = texto(clave).replace(/[^0-9]/g, "");
      return bruto ? Number(bruto) : null;
    };

    try {
      await enviarLead({
        nombre: texto("nombre"),
        empresa: texto("empresa") || undefined,
        email: texto("email"),
        telefono: texto("telefono") || undefined,
        rubro: texto("rubro") || undefined,
        productos: texto("productos") || undefined,
        cantidad: numero("cantidad"),
        monto_estimado: numero("monto"),
        comuna: texto("comuna") || undefined,
        plazo: texto("plazo") || undefined,
        necesita_factura: datos.get("factura") === "on",
        mensaje: texto("mensaje") || undefined,
      });
      setListo(true);
    } catch (fallo) {
      // Nunca dejar al visitante sin salida: si la base no responde, sigue
      // teniendo el WhatsApp a la vista.
      setError(fallo instanceof Error ? fallo.message : "error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  if (listo) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="flex items-center gap-2 text-base font-semibold">
          <Check className="size-5 text-emerald-600" aria-hidden />
          Recibimos su solicitud
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Le respondemos con la propuesta dentro de 24 horas hábiles. Si lo
          necesita antes, escríbanos por WhatsApp y lo vemos al tiro.
        </p>
        <a
          href={whatsappLink("Hola, acabo de enviar una solicitud de cotización por volumen.")}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
        >
          <MessageCircle className="size-4" aria-hidden />
          Escribir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={etiqueta} htmlFor="nombre">
            Nombre y apellido *
          </label>
          <input id="nombre" name="nombre" required className={campo} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="empresa">
            Empresa o institución
          </label>
          <input id="empresa" name="empresa" className={campo} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="email">
            Correo *
          </label>
          <input id="email" name="email" type="email" required className={campo} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="telefono">
            Teléfono
          </label>
          <input id="telefono" name="telefono" type="tel" className={campo} />
        </div>
        <div>
          <label className={etiqueta} htmlFor="rubro">
            Rubro
          </label>
          <select id="rubro" name="rubro" defaultValue="" className={campo}>
            <option value="">Seleccione</option>
            {RUBROS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={etiqueta} htmlFor="comuna">
            Comuna de entrega
          </label>
          <input id="comuna" name="comuna" className={campo} />
        </div>
        <div className="sm:col-span-2">
          <label className={etiqueta} htmlFor="productos">
            Qué necesita equipar
          </label>
          <input
            id="productos"
            name="productos"
            placeholder="Ej: 20 escritorios y 20 sillas ergonómicas"
            className={campo}
          />
        </div>
        <div>
          <label className={etiqueta} htmlFor="cantidad">
            Cantidad aproximada
          </label>
          <input
            id="cantidad"
            name="cantidad"
            inputMode="numeric"
            placeholder="Unidades"
            className={campo}
          />
        </div>
        <div>
          <label className={etiqueta} htmlFor="monto">
            Presupuesto estimado
          </label>
          <select id="monto" name="monto" defaultValue="" className={campo}>
            <option value="">Seleccione</option>
            {TRAMOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.texto}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={etiqueta} htmlFor="plazo">
            Para cuándo lo necesita
          </label>
          <select id="plazo" name="plazo" defaultValue="" className={campo}>
            <option value="">Seleccione</option>
            {PLAZOS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={etiqueta} htmlFor="mensaje">
            Algo más que debamos saber
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          id="factura"
          name="factura"
          defaultChecked
          className="size-4 rounded border-border"
        />
        Necesito factura a nombre de la empresa
      </label>

      <button
        type="submit"
        disabled={enviando}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
      >
        {enviando && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {enviando ? "Enviando…" : "Pedir mi cotización"}
      </button>

      <p className="mt-3 text-xs text-muted-foreground">
        Respuesta en 24 horas hábiles. Sus datos se usan solo para preparar la
        propuesta.
      </p>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
          No pudimos registrar su solicitud ({error}). Escríbanos por WhatsApp y
          lo resolvemos de inmediato.
        </p>
      )}
    </form>
  );
}
