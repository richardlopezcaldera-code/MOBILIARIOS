import Image from "next/image";
import Link from "next/link";

/**
 * Cinta dieciochera: guirnalda de banderines, fonda bailando cueca y la
 * lluvia de septiembre.
 *
 * Se retira sola. La ventana está acá abajo y no depende de que nadie se
 * acuerde de bajarla: pasado el 25 a medianoche el componente devuelve null y
 * la cinta desaparece del sitio en el siguiente refresco del catálogo (60 s).
 *
 * Las siluetas son dibujo propio, no fotos ni imágenes de terceros.
 */

/**
 * Chile está en UTC-3 (horario de verano, comprobado contra el reloj real el
 * 13-09-2026). La ventana va desde el 13 a las 00:00 hasta el 26 a las 00:00,
 * o sea el 25 completo incluido.
 */
const DESDE = Date.parse("2026-09-13T00:00:00-03:00");
const HASTA = Date.parse("2026-09-26T00:00:00-03:00");

export function vigente(ahora: number = Date.now()): boolean {
  return ahora >= DESDE && ahora < HASTA;
}

/** Banderines colgados de la cuerda, repartidos parejo. */
const BANDERINES = Array.from({ length: 31 }, (_, i) => {
  const x = 8 + i * 20;
  const y = 3 + Math.sin(i / 3.6) * 3.4;
  return {
    i,
    puntos: `${x - 4},${y} ${x + 4},${y} ${x},${y + 8.5}`,
    color: ["#0033A0", "#FFFFFF", "#D52B1E"][i % 3],
  };
});

/** Gotas con posiciones fijas: iguales en el servidor y en el navegador. */
const GOTAS = Array.from({ length: 20 }, (_, i) => ({
  i,
  left: (i * 41) % 100,
  alto: 7 + ((i * 5) % 6),
  dur: 0.7 + ((i * 3) % 7) / 10,
  esp: ((i * 11) % 25) / 10,
}));

function El() {
  return (
    <>
      <path className="mt-panuelo" d="M12 8 q7 -5 12 -1 q-5 4.5 -12 1z" fill="currentColor" opacity=".8" />
      <path d="M13.5 10 L17.5 16.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" fill="none" />
      <ellipse cx="19" cy="9.6" rx="7.4" ry="1.5" fill="currentColor" />
      <path d="M15.6 9.6 a3.5 3.5 0 0 1 6.8 0z" fill="currentColor" />
      <circle cx="19" cy="13" r="2.5" fill="currentColor" />
      <path d="M19 15.5 L19 25.5 M19 25.5 L14.8 35.5 M19 25.5 L23.4 35" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" fill="none" />
      <path d="M19 18.5 L25 22.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" fill="none" />
    </>
  );
}

function Ella() {
  return (
    <>
      <path className="mt-panuelo" d="M13 7 q7 -5 12 -1 q-5 4.5 -12 1z" fill="currentColor" opacity=".8" />
      <path d="M14.5 9 L18.5 15.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="20.5" cy="11.5" r="2.5" fill="currentColor" />
      <path d="M20.5 14 L20.5 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path className="mt-falda" d="M20.5 20 L13 35.5 L28 35.5z" fill="currentColor" />
      <path d="M20.5 16.5 L26.5 20.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  );
}

function Guitarrero() {
  return (
    <>
      <circle cx="15" cy="11" r="2.6" fill="currentColor" />
      <path d="M15 13.6 L15 22" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" fill="none" />
      <path d="M15 22 L10 27 M15 22 L21 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="18.5" cy="21" rx="6" ry="4.6" fill="currentColor" opacity=".92" />
      <path d="M23 19.5 L29.5 15.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" />
      <g className="mt-rasgueo">
        <path d="M13.5 16.5 L19 20.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

export function FondaBanner() {
  if (!vigente()) return null;

  return (
    <div
      className="relative isolate overflow-hidden bg-[#FBF7F0] text-[#14375D]"
      style={{ backgroundImage: "linear-gradient(180deg,#FBF7F0 0%,#F4EEE2 100%)" }}
    >
      {/* guirnalda */}
      <svg
        className="mt-guirnalda pointer-events-none absolute -left-[2%] -right-[2%] top-0 z-20 h-4 w-[104%]"
        viewBox="0 0 620 16"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 3 Q155 12 310 6 T620 3" fill="none" stroke="#C2CAD6" strokeWidth="1" />
        {BANDERINES.map((b) => (
          <polygon
            key={b.i}
            points={b.puntos}
            fill={b.color}
            stroke={b.color === "#FFFFFF" ? "#C2CAD6" : undefined}
            strokeWidth={b.color === "#FFFFFF" ? 0.7 : undefined}
          />
        ))}
      </svg>

      {/* lluvia */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
        {GOTAS.map((g) => (
          <span
            key={g.i}
            className="mt-gota-18"
            style={{
              left: `${g.left}%`,
              height: `${g.alto}px`,
              animationDuration: `${g.dur}s`,
              animationDelay: `${g.esp}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-30 mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-3 pb-2">
        <Image
          src="/images/emblema-mtc.png"
          alt=""
          width={480}
          height={480}
          className="size-[22px] shrink-0"
        />
        <p className="text-[13.5px] leading-tight font-bold tracking-tight">
          Septiembre en MobiliarioTech
          <span className="block text-[11.5px] font-normal tracking-normal text-[#5A6B80]">
            Precio por volumen desde $1.000.000 · respuesta en 24 horas
          </span>
        </p>

        {/* la fonda */}
        <svg
          className="h-14 w-[150px] shrink-0 text-[#D52B1E] sm:w-[186px]"
          viewBox="0 0 186 56"
          aria-hidden
        >
          {/* la pareja del fondo: más chica y desvaída, para dar profundidad */}
          <g opacity=".34" transform="translate(96 2) scale(.72)">
            <g className="mt-bailarin mt-lento">
              <El />
            </g>
            <g className="mt-bailarina mt-lento" transform="translate(27)">
              <Ella />
            </g>
          </g>
          <g transform="translate(0 12) scale(.9)" opacity=".6">
            <Guitarrero />
          </g>
          <g className="mt-bailarin" transform="translate(32 12)">
            <El />
          </g>
          <g className="mt-bailarina" transform="translate(60 12)">
            <Ella />
          </g>
          <rect x="2" y="51" width="182" height="2" rx="1" fill="currentColor" opacity=".2" />
        </svg>

        <Link
          href="/mayoristas"
          className="ml-auto inline-flex h-7 shrink-0 items-center rounded-md bg-[#D52B1E] px-3.5 text-[12.5px] font-bold text-white hover:bg-[#B8241A] max-sm:ml-0 max-sm:h-8 max-sm:w-full max-sm:justify-center"
        >
          Cotizar
        </Link>
      </div>
    </div>
  );
}
