# MobiliarioTech — tienda Next.js

Construida sobre la plantilla `ai-website-cloner-template`, usando `relampago.shop`
solo como **referencia de estructura y UX**. Ningún texto, imagen ni activo de
ese sitio fue copiado.

## Datos

Catálogo leído de tu tienda Jumpseller `mobiliariotech`, **solo lectura**. Nada
se escribió en Jumpseller en ningún momento.

- `src/data/products.json` — 962 productos con imagen
- `src/data/categories.json` — 39 categorías con jerarquía

Snapshot del 20 de agosto de 2026. No se sincroniza solo.

## Rutas

| Ruta | Qué hace |
|---|---|
| `/` | Portada: hero, ofertas, destacados, filas por categoría |
| `/categoria/[...slug]` | Categoría y subcategorías, 48 productos por página |
| `/producto/[slug]` | Ficha con galería, precio, stock, agregar al carro |
| `/buscar?q=` | Búsqueda por nombre, SKU y descripción |
| `/carro` | Carro con cantidades, eliminar, neto + IVA + total |
| `/checkout` | Datos del cliente, pago en Jumpseller o envío del pedido |
| `/admin` | Panel de productos en modo borrador |
| `/mayoristas` | Cotización por volumen |

## IVA — importante

Los precios del catálogo son **netos**. Verificado contra tu tienda: "Banca
Blanca Plaza 1,8 m" son $280.800 netos + $53.352 de IVA = $334.152. El carro y
el checkout muestran los tres valores para que el cliente vea lo que va a pagar.

## Pago

El pago ocurre en **tu checkout de Jumpseller**, con la pasarela que ya tienes
contratada. Las pasarelas no se pueden extraer de Jumpseller: el contrato está
atado a la plataforma.

Formato verificado en tu tienda:

- `/cart/add/<id>?qty=N` agrega un producto — la cantidad va en `qty`,
  **no** en `quantity` (ese parámetro se ignora).
- Un producto por URL. El formato `id:cantidad,id:cantidad` **no** funciona:
  toma solo el primer id y agrega 1 unidad.
- Los productos se acumulan en la misma sesión de carro.

Por eso `PayAtStore` abre una ventana y la navega producto por producto, con
1,8 s entre cada uno, y termina en el carro de la tienda. Si el navegador
bloquea la ventana emergente, muestra los enlaces numerados como alternativa.

El avance va por tiempo porque no se puede leer el estado de una ventana de
otro dominio. Con carros muy grandes conviene probarlo.

## Panel de administración

`/admin` funciona en **modo borrador**: los cambios se guardan solo en el
navegador y se exportan a CSV. Nada se escribe en Jumpseller. Puedes editar
nombre, precio neto y stock, y crear productos nuevos.

## Verificado

- `npm run build`, `npm run lint`, `npm run typecheck` ✅
- **24 pruebas end-to-end en Chromium**: carro (agregar, cantidades,
  persistencia, sincronía entre pestañas), cálculo de IVA, validación del
  checkout, armado del pedido, panel de borradores y títulos de página.
- Correcciones encontradas al probar: el sufijo duplicado en los títulos, un
  enlace sin `href` que no era accesible cuando faltaban datos, y la hidratación
  del carro que se quedaba en "Cargando" con el carro vacío.

## Pendiente de tu decisión

1. **Colores de marca.** El azul es elección mía; no pude descargar tu logo
   desde el entorno de trabajo. Pásame el logo o los colores y los ajusto.
2. **Despacho.** No hay ninguna promesa de cobertura en el sitio porque no la
   tengo confirmada. Vi en tu tienda un envío gratis Starken sobre $300.000
   — dime si va y lo agrego.
3. **Publicar.** El proyecto no está subido a GitHub todavía.
