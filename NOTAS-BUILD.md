# MobiliarioTech — estado del proyecto

Última actualización: 20 de agosto de 2026

Sitio Next.js construido sobre la plantilla `ai-website-cloner-template`, usando
`relampago.shop` solo como referencia de estructura y UX. Ningún texto, imagen
ni activo de ese sitio fue copiado.

## Cómo levantarlo

```powershell
cd "$HOME\Desktop\MOBILIARIOS"
npm install
npm run dev
```

Requiere **Node 24 o superior**.

## Rutas

| Ruta | Qué hace |
|---|---|
| `/` | Portada: hero, banner de clima, filas rotativas, categorías |
| `/categoria/[...slug]` | Categoría y subcategorías, 48 por página |
| `/producto/[slug]` | Ficha con galería, stock y agregar al carro |
| `/buscar?q=` | Búsqueda por nombre, SKU y descripción, sin tildes |
| `/carro` | Cantidades, eliminar, neto + IVA + total |
| `/checkout` | Datos del cliente, pago en Jumpseller o envío del pedido |
| `/blog` y `/blog/[slug]` | 5 guías ordenadas según el clima del día |
| `/admin` | Panel de productos en modo borrador (`noindex`) |
| `/mayoristas` | Cotización por volumen |
| `/api/revalidate` | Webhook para refrescar el catálogo |

## Datos: dos modos

**Sin credenciales** (como está ahora): usa el snapshot de `src/data/`, 962
productos y 39 categorías exportados el 20 de agosto. Funciona, pero congelado.

**Con credenciales** en `.env.local` (ver `.env.example`): lee el catálogo en
vivo desde la API de Jumpseller, con caché de 10 minutos y webhook para
refrescar al instante. Si la API falla, vuelve solo al snapshot — probado
apagando la API, el sitio siguió respondiendo 200.

Nada se escribe nunca en Jumpseller.

## Decisiones tomadas

**IVA.** Los precios del catálogo son netos. Verificado contra la tienda:
"Banca Blanca Plaza 1,8 m" son $280.800 netos + $53.352 de IVA. El carro y el
checkout muestran los tres valores.

**Pago.** Ocurre en el checkout de Jumpseller, con la pasarela ya contratada.
Formato verificado: `/cart/add/<id>?qty=N`, un producto por URL — el parámetro
`quantity` se ignora y el formato `id:cantidad,id:cantidad` no funciona.

**Despacho.** El sitio no promete cobertura, plazos ni costos. Decidido: **no
incluir** el envío gratis por Starken de la tienda actual.

**Colores.** Azul del header y azul rey `#1B3FBF` en el footer. El royal blue
clásico `#4169E1` quedaba en 4,6:1 de contraste, al filo de lo legible.
Pendiente unificar cuando haya logo o colores oficiales de marca.

**Medios de pago.** Los logos salen del CDN de Jumpseller, los mismos que usa
la tienda. `oneclick.svg` se ve como el logo de Webpay. No agregar aquí un
medio que no esté activo en Jumpseller.

**Animaciones.** Filas que rotan de a 10 cada 15 s, pausables. Efecto de lluvia
o nieve solo cuando el clima real lo amerita, sutil y desactivable. Todo
respeta `prefers-reduced-motion`.

**Timeouts.** El clima se consulta desde el layout: sin límite de tiempo, una
API lenta congelaba todas las páginas. Clima 3 s, Jumpseller 8 s.

## Verificación

`npm run build`, `lint` y `typecheck` en verde.

**34 pruebas end-to-end en Chromium** (`test-carro.mjs` en el entorno de
trabajo): carro, IVA, checkout, panel de borradores, rotación, blog, WhatsApp
y títulos.

El modo headless se probó contra un servidor que imita la API de Jumpseller:
autenticación, paginado, descarte de productos sin imagen y caída de la API.

## Pendiente

1. Logo y colores oficiales para unificar los dos azules.
2. Subir a GitHub: el repo `MOBILIARIOS` sigue vacío.
3. El plan de dominios y redirecciones está en `PLAN-DOMINIOS.md`.
