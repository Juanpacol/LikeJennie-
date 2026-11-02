# Auditoría responsive

Fecha: 2026-11-01. Estado final: 2026-11-02, con las PRs #119 a #124 mergeadas en `main`.

## Método y alcance

Lectura de código más una pasada en Chrome contra el backend y la base de datos reales. `resize_window` no cambia el viewport que ven los media queries, así que las páginas se cargaron en iframes del mismo origen con ancho fijo y el desborde se midió por JS (`scrollWidth` y elementos que sobresalen sin un contenedor con `overflow`). El procedimiento quedó en el Manual del Programador, sección 7.1.

**Medido:**
- Rutas públicas (`/`, `/catalogo`, `/colecciones/haribo`, `/productos/:slug`, `/pago/exito`, `/pago/cancelado`) y `/admin/login` a 320, 375, 768, 1024 y 1440 px, y en horizontal (812×375): sin desborde horizontal.
- Admin (`/admin`, `/admin/products`, `/new`, `/edit`) a 320 y 375 px.
- Capturas de home y producto a 800 px, catálogo a 1000 px, lista de productos a 375 y 1100 px, y formulario de productos a 320 px.

**No medido:**
- Un dispositivo táctil real ni Safari de iOS (zoom al enfocar, hover pegado).
- La animación de entrada de `PaymentResult`.
- El flujo de pago con Stripe de punta a punta en móvil.
- El admin a 768 y 1024 px.

Ya cubierto antes de esta auditoría: menú móvil, home, catálogo, colecciones, detalle de producto, carrito, aviso al agregar y Lookbook en tablet.

## Estado de los hallazgos

### Panel admin

| # | Problema | Estado |
|---|---|---|
| A1 | La tabla de `Products.jsx` medía 383 px y desbordaba a 320 y 375 px. | Resuelto en #120: bajo `sm` se ocultan Categoría y Estado y pasan a texto bajo el nombre. |
| A2 | Filas de variantes con anchos fraccionarios. A 320 px cabían (72/96/72 px), pero sin margen. | Resuelto en #120: `flex-1 min-w-0`, y «Quitar» con `shrink-0`. |
| A3 | Precio y precio de oferta en dos columnas fijas. | Resuelto en #120: una columna bajo `sm`. |
| A4 | Inputs del admin de 14 px; iOS hace zoom al enfocar. | Resuelto en #121: 16 px bajo 768 px, acotado con `.admin-area`. |
| A5 | Enlaces de `AdminNav` de 20 px de alto. | Resuelto en #121: 44 px. No se agregó indicación de la sección activa. |
| A6 | Filas del dashboard sin `gap` ni `min-w-0`. | Resuelto en #121. |
| A7 | El admin mostraba el header y el footer de la tienda. | Resuelto en #121: `/admin/*` no los renderiza. Consecuencia: el admin no tiene enlace de vuelta a la tienda. |

### Sitio público

| # | Problema | Estado |
|---|---|---|
| P1 | `PaymentResult` restaba 88 px de alto siempre; el header mide 68 px bajo `lg`. | Resuelto en #123. Medido a 375×812: la sección mide 744 px (812 − 68). |
| P2 | Íconos de redes de 18 px. | Resuelto en #122: área tocable de 26 px. |
| P3 | Botones de cantidad de 32 px y «Quitar» con poco alto. | Resuelto en #122: 40 px. |
| P4 | Muchos textos `font-mono text-[10px]`. | **Pendiente.** No se tocó; la legibilidad es justa en móvil. |
| P5 | Mezcla de `md` y `lg` en los layouts. | Sin fallo visible a 800 px. No requirió cambios. |
| P6 | `HeroCurtain` usaba `md:h-screen` (`100vh`). | Resuelto en #123: `md:h-[100svh]`. |
| P7 | `PosterLookbook` con `min-h-[640px]` supera la ventana en horizontal. | **No resuelto, aceptado.** En horizontal el contenido se alcanza con scroll. |
| P8 | Detalle de producto en una columna en tablet. | Descartado: a 800 px se ve bien. |
| P9 | `hover:` pegado en táctil (Tailwind 3). | Resuelto en #122: `future.hoverOnlyWhenSupported`. Sin probar en un dispositivo real. |
| P10 | Marco de marca en móvil. | Descartado: ya se oculta bajo 768 px (`index.css`). |
| P11 | Íconos del header de 24 px y enlaces del footer de 16 px de alto. | Resuelto en #122: header ≈40 px de área tocable y footer de 24 px de alto. No llega a 44 px porque el hueco entre íconos es de 12 px. |

## Pendiente

1. Probar en un dispositivo táctil real y en Safari de iOS: zoom al enfocar, hover pegado, barra de inicio.
2. Probar el pago de Stripe de punta a punta en móvil.
3. P4: decidir si subir los textos de 10 px a 11 o 12 px.
4. Revisar el admin a 768 y 1024 px.
5. Si hace falta volver a la tienda desde el admin, agregar un enlace «Ver tienda» en `AdminNav`.
