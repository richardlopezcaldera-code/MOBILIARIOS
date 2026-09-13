import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";

import { STORE, whatsappLink } from "@/lib/store";
import type { Category } from "@/lib/catalog";

const NECESIDADES = [
  "Puestos de trabajo",
  "Sala de reuniones",
  "Casino o comedor",
  "Bodega y archivo",
  "Sala de clases",
  "Otro",
];

export function Hero({ total }: { total: number; categories: Category[] }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 to-background">
      {/* Marca de agua: emblema MTC centrado, decorativo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/images/emblema-mtc.png"
          alt=""
          width={480}
          height={480}
          className="w-[340px] max-w-[85%] opacity-[0.11] sm:w-[500px] lg:w-[680px]"
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.15fr_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div>
          <p className="inline-flex items-center rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            Venta corporativa
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Equipe la oficina completa con una sola contraparte
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground text-pretty">
            {total.toLocaleString("es-CL")} productos en catálogo, cotización formal
            por volumen y despacho a todo Chile. Atendemos empresas, colegios,
            clínicas y restaurantes con factura y orden de compra.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mayoristas"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Solicitar cotización por volumen
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/categoria/ofertas-del-dia"
              className="inline-flex h-12 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              Ver ofertas
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 shrink-0 text-primary" aria-hidden />
            Respuesta en{" "}
            <strong className="font-semibold text-foreground">24 horas</strong> · sin
            monto mínimo de compra
          </p>
        </div>

        {/* Tarjeta de cotización rápida */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight">
            Cotización en tres datos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Un ejecutivo responde en 24 horas con el precio de catálogo y el plazo de
            entrega.
          </p>

          <form action="/mayoristas" method="get" className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Empresa</span>
              <input
                type="text"
                name="empresa"
                placeholder="Razón social o RUT"
                className="h-11 rounded-lg border border-border bg-background px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Qué necesita</span>
                <select
                  name="necesidad"
                  defaultValue={NECESIDADES[0]}
                  className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  {NECESIDADES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Cantidad</span>
                <input
                  type="number"
                  name="cantidad"
                  min={1}
                  placeholder="25"
                  className="h-11 rounded-lg border border-border bg-background px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </label>
            </div>

            <button
              type="submit"
              className="h-12 rounded-lg bg-offer text-sm font-bold text-offer-foreground hover:bg-offer/90"
            >
              Pedir cotización
            </button>
          </form>

          <a
            href={whatsappLink(
              "Hola, necesito una cotización por volumen para equipar un espacio.",
            )}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            o escríbanos al WhatsApp{" "}
            <strong className="font-semibold text-foreground">
              {STORE.whatsappDisplay}
            </strong>
          </a>
        </div>
      </div>
    </section>
  );
}
