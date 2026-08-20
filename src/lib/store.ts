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
    latitude: -33.4694,
    longitude: -70.6345,
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

/**
 * Los precios del catálogo son NETOS: la tienda suma el IVA en el checkout.
 * Verificado contra mobiliariostechchile.cl (neto $280.800 → IVA $53.352).
 */
export const IVA_RATE = 0.19;

export function iva(net: number): number {
  return Math.round(net * IVA_RATE);
}

export function grossTotal(net: number): number {
  return net + iva(net);
}

/**
 * El checkout ocurre en Jumpseller, con la pasarela ya contratada.
 * Formato verificado en la tienda: un producto por URL, cantidad con `qty`.
 * No acepta varios productos en una sola URL.
 */
export function jumpsellerAddUrl(productId: number, quantity: number): string {
  return `${STORE.url}/cart/add/${productId}?qty=${quantity}`;
}

export const JUMPSELLER_CART_URL = `${STORE.url}/cart`;
