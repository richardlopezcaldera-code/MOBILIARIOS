import { STORE, whatsappLink } from "@/lib/store";

/**
 * Botón flotante de WhatsApp, como el que ya tiene la tienda actual.
 * Va abajo a la derecha para no chocar con el botón del efecto de clima.
 */
export function WhatsappButton() {
  return (
    <a
      href={whatsappLink("Hola, quiero hacer una consulta.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp al ${STORE.whatsappDisplay}`}
      className="group fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] py-3 pr-4 pl-3 text-sm font-medium text-white shadow-lg transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 shrink-0"
        aria-hidden
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.944c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.585 0 11.946-5.359 11.949-11.945a11.9 11.9 0 0 0-3.421-8.4" />
      </svg>
      <span className="hidden sm:inline">Escríbenos</span>
    </a>
  );
}
