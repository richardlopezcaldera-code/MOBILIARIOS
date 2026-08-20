"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { PayAtStore } from "@/components/site/pay-at-store";
import { STORE, formatCLP, grossTotal, iva, whatsappLink } from "@/lib/store";
import { useCart } from "@/lib/cart-context";

interface Form {
  nombre: string;
  telefono: string;
  email: string;
  rut: string;
  entrega: "retiro" | "despacho";
  direccion: string;
  comuna: string;
  notas: string;
}

const EMPTY: Form = {
  nombre: "",
  telefono: "",
  email: "",
  rut: "",
  entrega: "despacho",
  direccion: "",
  comuna: "",
  notas: "",
};

/**
 * Cuando faltan datos se renderiza un <button disabled> en vez de un <a> sin
 * href: un enlace sin destino no es enfocable ni se anuncia como enlace.
 */
function SendAction({
  disabled,
  href,
  variant,
  icon,
  label,
}: {
  disabled: boolean;
  href: string;
  variant: "primary" | "outline";
  icon: React.ReactNode;
  label: string;
}) {
  const base =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium";

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`${base} cursor-not-allowed bg-muted text-muted-foreground`}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={
        variant === "primary"
          ? `${base} bg-primary text-primary-foreground hover:bg-primary/90`
          : `${base} border border-border hover:bg-muted`
      }
    >
      {icon}
      {label}
    </a>
  );
}

export default function CheckoutPage() {
  const { lines, total, count, ready } = useCart();
  const [form, setForm] = useState<Form>(EMPTY);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const missing =
    !form.nombre.trim() ||
    !form.telefono.trim() ||
    (form.entrega === "despacho" &&
      (!form.direccion.trim() || !form.comuna.trim()));

  function buildOrder(): string {
    const items = lines
      .map(
        (line) =>
          `• ${line.quantity} × ${line.name}${line.sku ? ` (SKU ${line.sku})` : ""} — ${formatCLP(line.price * line.quantity)}`,
      )
      .join("\n");

    const entrega =
      form.entrega === "retiro"
        ? `Retiro en tienda (${STORE.address.street}, ${STORE.address.city})`
        : `Despacho a ${form.direccion}, ${form.comuna}`;

    return [
      "NUEVO PEDIDO",
      "",
      items,
      "",
      `Neto: ${formatCLP(total)}`,
      `IVA (19%): ${formatCLP(iva(total))}`,
      `Total: ${formatCLP(grossTotal(total))} (sin despacho)`,
      "",
      `Nombre: ${form.nombre}`,
      `Teléfono: ${form.telefono}`,
      form.email ? `Email: ${form.email}` : null,
      form.rut ? `RUT: ${form.rut}` : null,
      `Entrega: ${entrega}`,
      form.notas ? `Notas: ${form.notas}` : null,
    ]
      .filter((row) => row !== null)
      .join("\n");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">No hay nada que pedir</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Agrega productos al carro antes de continuar.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const field =
    "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Finalizar pedido
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Completa tus datos y envíanos el pedido. Te confirmamos stock, despacho y
        forma de pago.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Nombre o empresa *</span>
              <input
                required
                value={form.nombre}
                onChange={(e) => update("nombre", e.target.value)}
                className={`mt-1.5 ${field}`}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Teléfono *</span>
              <input
                required
                type="tel"
                placeholder="+56 9 ..."
                value={form.telefono}
                onChange={(e) => update("telefono", e.target.value)}
                className={`mt-1.5 ${field}`}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={`mt-1.5 ${field}`}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">RUT (para factura)</span>
              <input
                value={form.rut}
                onChange={(e) => update("rut", e.target.value)}
                className={`mt-1.5 ${field}`}
              />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Entrega</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {(
                [
                  { value: "despacho", label: "Despacho a domicilio" },
                  { value: "retiro", label: "Retiro en tienda" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
                    form.entrega === option.value
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="entrega"
                    className="sr-only"
                    checked={form.entrega === option.value}
                    onChange={() => update("entrega", option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          {form.entrega === "despacho" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Dirección *</span>
                <input
                  value={form.direccion}
                  onChange={(e) => update("direccion", e.target.value)}
                  className={`mt-1.5 ${field}`}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Comuna *</span>
                <input
                  value={form.comuna}
                  onChange={(e) => update("comuna", e.target.value)}
                  className={`mt-1.5 ${field}`}
                />
              </label>
            </div>
          ) : (
            <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Retiras en {STORE.address.street}, {STORE.address.city}. Te avisamos
              cuando el pedido esté listo.
            </p>
          )}

          <label className="block">
            <span className="text-sm font-medium">Notas del pedido</span>
            <textarea
              rows={3}
              value={form.notas}
              onChange={(e) => update("notas", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>

          <p className="text-xs text-muted-foreground">* Campos obligatorios</p>
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-40">
          <h2 className="text-sm font-semibold">Tu pedido</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-muted-foreground">
                  {line.quantity} × {line.name}
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatCLP(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Neto ({count})</dt>
              <dd className="tabular-nums">{formatCLP(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">IVA (19%)</dt>
              <dd className="tabular-nums">{formatCLP(iva(total))}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatCLP(grossTotal(total))}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            El despacho se calcula en el checkout según la dirección.
          </p>

          <div className="mt-5">
            <PayAtStore lines={lines} />
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              o envíanos el pedido
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <SendAction
              disabled={missing}
              href={missing ? "" : whatsappLink(buildOrder())}
              variant="primary"
              icon={<MessageCircle className="size-4" aria-hidden />}
              label="Enviar por WhatsApp"
            />
            <SendAction
              disabled={missing}
              href={
                missing
                  ? ""
                  : `mailto:${STORE.email}?subject=${encodeURIComponent(
                      `Pedido de ${form.nombre}`,
                    )}&body=${encodeURIComponent(buildOrder())}`
              }
              variant="outline"
              icon={<Mail className="size-4" aria-hidden />}
              label="Enviar por correo"
            />
          </div>

          {missing && (
            <p className="mt-3 text-xs text-muted-foreground">
              Completa nombre, teléfono
              {form.entrega === "despacho" ? ", dirección y comuna" : ""} para
              enviar el pedido.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
