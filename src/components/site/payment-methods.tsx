import { cn } from "@/lib/utils";

/**
 * Medios de pago habilitados en Jumpseller. Los logos vienen del mismo CDN
 * que usa la tienda, así siempre reflejan lo que de verdad está activo.
 *
 * No agregar aquí un medio que no esté configurado en Jumpseller: prometer
 * una forma de pago que después no aparece es peor que no mostrarla.
 */
export const PAYMENTS = [
  {
    name: "Mercado Pago",
    alt: "Mercado Pago — crédito, débito, prepago y transferencia",
    src: "https://assets.jumpseller.com/public/payment-logos/mercadopago.svg",
  },
  {
    name: "Flow",
    alt: "Flow",
    src: "https://assets.jumpseller.com/public/payment-logos/flow.svg",
  },
  {
    name: "Transferencia",
    alt: "Transferencia bancaria",
    src: "https://assets.jumpseller.com/public/payment-logos/manual.svg",
  },
  {
    name: "Webpay",
    alt: "Webpay Oneclick — Transbank",
    src: "https://assets.jumpseller.com/public/payment-logos/oneclick.svg",
  },
];

export function PaymentMethods({
  size = "normal",
  className,
}: {
  size?: "normal" | "compact";
  className?: string;
}) {
  const compact = size === "compact";

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-2",
        compact ? "gap-2" : "gap-3",
        className,
      )}
    >
      {PAYMENTS.map((payment) => (
        <li
          key={payment.name}
          title={payment.alt}
          className={cn(
            "flex items-center justify-center rounded-lg border border-border bg-background",
            compact ? "h-11 w-20 p-2" : "h-16 w-28 p-3",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={payment.src}
            alt={payment.alt}
            width={compact ? 64 : 96}
            height={compact ? 28 : 40}
            loading="lazy"
            className={cn(
              "w-auto object-contain",
              compact ? "max-h-7" : "max-h-10",
            )}
          />
        </li>
      ))}
    </ul>
  );
}
