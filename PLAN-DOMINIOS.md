# Plan completo — MobiliarioTech headless

Fecha: 20 de agosto de 2026

## La arquitectura

Una sola marca, tres piezas, un solo lugar donde vive la verdad.

```
   www.mobiliariostech.cl          ← vitrina pública (Next.js, en Vercel)
              │                       lo que ve el cliente y lo que indexa Google
              │  lee catálogo por API
              ▼
   tienda.mobiliariostech.cl       ← Jumpseller: carro, pago, boleta, despacho
              │                       y el panel donde llegan los pedidos
              │                       con noindex, para no competir en Google
              ▼
   mobiliariostechchile.cl         ← redirección 301 al dominio nuevo
```

**Jumpseller sigue siendo el master.** Los pedidos del sitio nuevo llegan a la
misma bandeja de siempre, con el mismo stock, la misma boleta y los mismos
medios de pago. No hay dos sistemas que cuadrar.

## Lo que ya está hecho (código)

- El sitio lee el catálogo desde la API de Jumpseller en vez del archivo
  congelado. Cambias un precio allá y aparece acá.
- Caché de 10 minutos, más un webhook que refresca al instante cuando editas
  algo. Consumo real: ~10 llamadas cada 10 minutos, contra un límite de 800
  por minuto.
- **Si la API falla, el sitio no se cae**: vuelve automáticamente al snapshot
  local. Probado apagando la API — el sitio siguió respondiendo 200.
- El webhook rechaza con 401 a quien no traiga el secreto correcto.

## Lo que tienes que hacer tú

Yo no puedo comprar dominios, cambiar DNS ni tocar la configuración de tu
cuenta. Estos pasos son tuyos. Van en este orden a propósito: lo que toca el
SEO va al final, cuando el sitio nuevo ya esté probado.

### Paso 1 — Credenciales de la API

En Jumpseller: **Configuración → API**. Genera el token.

Crea el archivo `.env.local` en la carpeta del proyecto (hay una plantilla en
`.env.example`) y pega ahí los valores:

```
JUMPSELLER_LOGIN=tu-login
JUMPSELLER_AUTHTOKEN=tu-token
REVALIDATE_SECRET=inventa-una-cadena-larga-y-aleatoria
```

`.env.local` está en `.gitignore`, así que no se sube a GitHub. **Nunca pegues
estas credenciales en un chat, ni en el mío.**

Levanta el sitio con `npm run dev` y entra a `/admin`: abajo del aviso amarillo
dice de dónde vienen los datos. Si dice "API de Jumpseller, en vivo", quedó.

### Paso 2 — Webhook de refresco

En Jumpseller: **Configuración → Webhooks**. Crea uno para eventos de producto
(crear, actualizar) apuntando a:

```
https://TU-DOMINIO/api/revalidate?secret=EL_MISMO_SECRETO_DEL_PASO_1
```

Sin esto igual funciona, pero los cambios tardan hasta 10 minutos en verse.

### Paso 3 — El dominio

`mobiliariostech.cl` está disponible. **Regístralo en NIC Chile**
(nic.cl), donde un `.cl` cuesta del orden de $10.000 al año. Vercel te lo cobra
a US$65 — no lo compres ahí.

El `.com` también está libre, a unos US$11 al año. Si lo tomas, apúntalo al
mismo sitio; no lo uses como segundo sitio.

### Paso 4 — Publicar el sitio nuevo

Subes el proyecto a GitHub y lo conectas a Vercel. En Vercel cargas las mismas
variables del Paso 1 (Settings → Environment Variables) y apuntas
`www.mobiliariostech.cl` al proyecto.

**Aquí paras y pruebas.** Navega el sitio, agrega al carro, paga de verdad una
compra chica. Recién cuando eso funcione, sigue al Paso 5.

### Paso 5 — Mover el dominio de Jumpseller

En Jumpseller cambias el dominio de la tienda a `tienda.mobiliariostech.cl`.

Este es el paso delicado: **las URLs actuales cambian**. Hazlo solo después de
que el Paso 4 esté probado, y con el Paso 6 listo para aplicar de inmediato.

### Paso 6 — Redirecciones 301

Sin esto pierdes el posicionamiento que ya tienes.

- `mobiliariostechchile.cl/*` → `www.mobiliariostech.cl/*`, con 301 y
  manteniendo la ruta.
- Las fichas de producto conservan el mismo `permalink`, así que la mayoría
  calza directo.
- Ya tienes un CSV de redirecciones de un trabajo anterior. Sirve de base,
  pero hay que revisarlo contra las rutas nuevas.

Después: reenviar el sitemap en Google Search Console y vigilar la cobertura
las siguientes semanas.

### Paso 7 — Evitar contenido duplicado

La tienda de Jumpseller pasa a ser solo carro y checkout, así que hay que
sacarla del índice de Google. Se hace desde la configuración SEO de Jumpseller
o por `robots.txt` en ese subdominio.

El panel `/admin` del sitio nuevo ya sale con `noindex` puesto.

## Costos

| Concepto | Costo | Nota |
|---|---|---|
| Dominio `.cl` | ~$10.000 CLP al año | En NIC Chile, no en Vercel |
| Vercel Pro | US$20 al mes | El plan gratis **prohíbe** uso comercial |
| Jumpseller | lo que ya pagas | No cambia |
| Mantención | tu tiempo o el de un desarrollador | El costo real |

Sobre Vercel: su plan Hobby excluye explícitamente sitios que procesan pagos o
venden productos. Una tienda no califica. Quien te diga que se hostea gratis no
leyó los términos.

## Riesgos, y qué hicimos con cada uno

**La API se cae** → el sitio vuelve al snapshot local. Ya probado.

**Se agota el límite de la API** → 800 req/min contra ~10 cada 10 minutos. Muy
lejos del techo. El secreto del webhook evita que alguien externo fuerce
recargas.

**Pérdida de SEO al mover dominios** → por eso el orden de los pasos, las 301
del Paso 6 y el noindex del Paso 7. Es el riesgo más real de todo el plan.

**Precios desactualizados** → el webhook vence el caché de inmediato en vez de
servir el precio viejo una vez más.

**Dependencia de un desarrollador para el diseño** → real y no la puedo
eliminar. Productos, precios, stock y fotos los manejas tú desde Jumpseller sin
tocar código. El diseño no.

## Lo que yo no puedo hacer

Comprar el dominio, cambiar DNS, tocar la configuración de tu cuenta de
Jumpseller o de Vercel, y manejar tus credenciales. Todo eso es tuyo, por
diseño. Lo que sí puedo es dejarte el código listo, revisar cada paso contigo y
corregir lo que salga mal.
