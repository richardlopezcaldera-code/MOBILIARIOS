# MobiliarioTech — tienda Next.js

Construida sobre la plantilla `ai-website-cloner-template`, usando `relampago.shop`
solo como **referencia de estructura y UX** (jerarquía de navegación, filas de
productos, anatomía de la tarjeta, bloques de confianza, footer multi-columna).
Ningún texto, imagen ni activo de ese sitio fue copiado.

## Datos

Todo el catálogo viene de tu tienda Jumpseller `mobiliariotech`, **en solo lectura**.
No se escribió nada en Jumpseller.

- `src/data/products.json` — 962 productos con imagen (de 963 disponibles; se
  excluyó el producto demo `demo-product`)
- `src/data/categories.json` — 39 categorías con jerarquía padre/hijo

Los datos son un **snapshot** del 20 de agosto de 2026. No se sincronizan solos:
si cambias precios o stock en Jumpseller, hay que regenerar los JSON.

## Rutas

| Ruta | Qué hace |
|---|---|
| `/` | Portada: hero, ofertas, destacados, filas por categoría, índice de categorías |
| `/categoria/[...slug]` | Categoría y subcategorías, 48 productos por página |
| `/producto/[slug]` | Ficha: galería, precio, descuento, stock, relacionados |
| `/buscar?q=` | Búsqueda por nombre, SKU y descripción (sin tildes) |
| `/mayoristas` | Cotización por volumen |
| `/carro` | Placeholder — el checkout no está conectado |

## Verificado

- `npm run build` ✅ · `npm run lint` ✅ · `npm run typecheck` ✅
- Rutas probadas en servidor de producción: todas 200; producto inexistente → 404
- Paginación: `/categoria/sillas` bajó de 1,6 MB a ~297 KB por página

## Pendiente de tu decisión

1. **Colores de marca.** Los tokens actuales (azul `oklch(0.52 0.15 253)` + ámbar
   para ofertas, en `src/app/globals.css`) son una elección mía: el logo de tu
   tienda no se pudo descargar desde este entorno. Pásame el logo o los colores
   oficiales y los ajusto.
2. **Despacho.** Quité toda mención a cobertura de envío porque no la tengo
   confirmada. Hay un `TODO` en `src/components/site/header.tsx`. Dime zonas,
   costos y plazos reales y los agrego.
3. **Checkout.** Hoy los productos se cotizan por WhatsApp o correo. Conectar
   pagos reales es un trabajo aparte.
4. **Imágenes.** Se sirven desde `images.jumpseller.com` (configurado en
   `next.config.ts`). En este entorno ese dominio está bloqueado, así que las
   fotos no se ven aquí — en tu máquina cargan normal.

## Regenerar el catálogo

Los JSON se generaron leyendo la API de Jumpseller vía MCP. Para actualizarlos,
pídemelo y vuelvo a exportarlos.
