/**
 * Datos de la tienda. Origen: Jumpseller (tienda `mobiliariotech`), solo lectura.
 */
export const STORE = {
  name: "MobiliarioTech",
  legalName: "Mobiliarios Tech Chile",
  url: "https://mobiliariostechchile.cl",
  email: "contacto@mobiliariostechchile.cl",
  whatsapp: "56961544423",
  whatsappDisplay: "+56 9 6154 4423",
  logo: "https://images.jumpseller.com/store/mobiliariotech/store/logo/Logo_Landing_Mobiliaria_TechChile.png?1773953790",
  currency: "CLP",
  address: {
    street: "Carmen 1865",
    city: "Santiago",
    region: "Región Metropolitana",
    postal: "8360884",
    country: "Chile",
  },
} as const;

export const NAV_HIGHLIGHTS = [
  { label: "Ofertas del Día", slug: "ofertas-del-dia" },
  { label: "Escritorios", slug: "escritorios" },
  { label: "Sillas", slug: "sillas" },
  { label: "Mesas", slug: "mesas" },
] as const;

export function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
