/**
 * Captura de interesados en compra por volumen.
 *
 * El formulario escribe directo a Supabase desde el navegador, igual que lo
 * hace el CRM. La clave de abajo es la publicable: está pensada para viajar en
 * el JavaScript del sitio y no abre nada por sí sola. Lo que protege los datos
 * son las políticas RLS de `leads_mayoristas`: anon puede INSERTAR y nada más,
 * así que nadie puede leerse la lista de prospectos desde afuera.
 */
const SUPABASE_URL = "https://awdgvtfchubneruyqman.supabase.co";
const SUPABASE_ANON = "sb_publishable_KTsmIkFTml63zXHpMyTxJA_EH3K_w_Y";

/** MobiliarioTech en el CRM. La política RLS solo acepta este id. */
const EMPRESA_ID = "2946a748-e1be-400f-ba3c-fd090ab1e5c1";

export interface Lead {
  nombre: string;
  empresa?: string;
  email: string;
  telefono?: string;
  rubro?: string;
  productos?: string;
  cantidad?: number | null;
  monto_estimado?: number | null;
  comuna?: string;
  plazo?: string;
  necesita_factura?: boolean;
  mensaje?: string;
}

/**
 * Tramos de presupuesto. Se guarda el piso del tramo, que es lo que decide si
 * el lead es mayorista: el umbral son $1.000.000.
 */
export const TRAMOS: { valor: number; texto: string }[] = [
  { valor: 0, texto: "Menos de $500.000" },
  { valor: 500000, texto: "$500.000 a $1.000.000" },
  { valor: 1000000, texto: "$1.000.000 a $3.000.000" },
  { valor: 3000000, texto: "$3.000.000 a $10.000.000" },
  { valor: 10000000, texto: "Más de $10.000.000" },
];

export const RUBROS = [
  "Oficina / corporativo",
  "Colegio o universidad",
  "Clínica o salud",
  "Restaurante u hotelería",
  "Retail o comercio",
  "Industria o bodega",
  "Institución pública",
  "Otro",
];

export const PLAZOS = [
  "Lo antes posible",
  "Dentro de 2 semanas",
  "Dentro de un mes",
  "Más de un mes",
  "Solo estoy cotizando",
];

/** Envía el lead. Lanza si la API responde con error, para poder avisarlo. */
export async function enviarLead(lead: Lead): Promise<void> {
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/leads_mayoristas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...lead, empresa_id: EMPRESA_ID, origen: "web" }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "");
    throw new Error(`${respuesta.status} ${detalle.slice(0, 200)}`);
  }
}
