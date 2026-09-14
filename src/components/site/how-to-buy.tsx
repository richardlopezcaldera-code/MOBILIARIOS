/**
 * Los tres pasos son la operación real de venta corporativa:
 * se cotiza, se aprueba y se factura. Sin carro ni registro previo.
 */
const PASOS = [
  {
    titulo: "Envíe el requerimiento",
    detalle:
      "Una lista, un plano o una foto de la oficina. Si no sabe qué necesita, un ejecutivo lo arma con usted.",
  },
  {
    titulo: "Reciba la cotización formal",
    detalle:
      "PDF con precios de catálogo, totales, plazo de entrega y validez, lista para adjuntar a la orden de compra.",
  },
  {
    titulo: "Coordine entrega y factura",
    detalle:
      "Despacho a la dirección que indique, con factura electrónica emitida a la razón social.",
  },
];

export function HowToBuy() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-14">
        {/* Sin marca de agua: el logo no va de fondo en ninguna sección.
            (Richard, 13-09-2026.) */}

        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Cómo compra una empresa
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/70">
            Sin registro previo ni carro de compras: se cotiza, se aprueba y se
            factura.
          </p>

          <ol className="mt-9 grid gap-8 sm:grid-cols-3">
            {PASOS.map(({ titulo, detalle }, i) => (
              <li key={titulo}>
                <span className="flex size-10 items-center justify-center rounded-xl bg-gold text-lg font-extrabold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                  {detalle}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
