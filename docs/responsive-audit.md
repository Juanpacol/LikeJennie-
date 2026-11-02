# Auditoría responsive (estática)

Fecha: 2026-11-01. Rama: `chore/responsive-audit`, creada desde `main` con el pago de Stripe ya mergeado.

## Alcance y límites

La auditoría combina lectura de código con una **pasada en navegador real** (Chrome, contra el backend y la base de datos reales). Como `resize_window` no cambió el viewport, las páginas se cargaron en iframes del mismo origen con ancho fijo, lo que sí activa los media queries; el desborde se midió por JS (`scrollWidth` y elementos que sobresalen sin contenedor con `overflow`).

Cubierto: rutas públicas (`/`, `/catalogo`, `/colecciones/haribo`, `/productos/:slug`, `/pago/exito`, `/pago/cancelado`) a 320, 375 y 768 px; admin (`/admin`, `/admin/products`, `/new`, `/edit`) a 320 y 375 px; capturas de home y producto a 800 px, catálogo a 1000 px y lista de productos a 375 px.
No cubierto: 1024 y 1440 px de forma sistemática, orientación horizontal, un dispositivo táctil real (hover pegado, zoom de iOS) y la animación de entrada de `PaymentResult`.

## Resultado de la verificación

- **Confirmado A1:** la tabla de `/admin/products` mide 383 px y desborda a 320 y 375 px; en la captura la columna «Eliminar» queda cortada en el borde.
- **Confirmado A4:** los inputs del admin miden 14 px de fuente (iOS hace zoom al enfocar).
- **Confirmado A5:** los enlaces de `AdminNav` miden 20 px de alto.
- **Confirmado A7:** el admin muestra el header público blanco y el footer del sitio.
- **A2 descartado como desborde:** a 320 px los inputs de variantes miden 72, 96 y 72 px y caben. Con una sola fila no aparece «Quitar»; queda por probar con dos o más filas, pero la prioridad baja a Baja.
- **P8 descartado:** el detalle de producto a 800 px apila bien (imagen centrada, panel rojo debajo). Home a 800 px y catálogo a 1000 px se ven correctos.
- **Sin desborde horizontal** en ninguna ruta pública a 320, 375 ni 768 px.
- **Hallazgo nuevo P11, media:** en móvil los íconos del header público (menú, buscar, cuenta, carrito) miden 24×24 px, y los enlaces del footer 16 px de alto. Ambos quedan muy por debajo de 44 px.

Ya cubierto en PRs anteriores (menú móvil, home, catálogo, colecciones, detalle de producto, carrito, aviso al agregar y Lookbook en tablet): no se re-audita aquí, salvo lo indicado.

Lo que sí está bien: `index.html` trae `viewport` con `viewport-fit=cover`, y los componentes públicos usan `svh`/`dvh` en los puntos críticos.

## Hallazgos del panel admin (prioridad alta)

El admin no tiene trabajo responsive previo. Rama destino: `feat/responsive-admin-shell` y `feat/responsive-admin-products`.

| # | Archivo | Problema | Severidad |
|---|---|---|---|
| A1 | `pages/admin/Products.jsx` | Tabla de 6 columnas dentro de `w-full` sin contenedor `overflow-x-auto`. Por debajo de ~640 px desborda la página o aplasta las columnas. La confirmación inline «¿Eliminar? Sí No» vive en la última celda y empeora el ancho. | Alta |
| A2 | `pages/admin/ProductForm.jsx` (variantes, modo crear) | Fila `flex` con tres inputs de ancho fraccionario (`w-1/4`, `w-1/3`, `w-1/4`) más el botón «Quitar». A 320 px los inputs miden 72/96/72 px y caben; falta probar con «Quitar» visible (2 o más filas). | Baja |
| A3 | `pages/admin/ProductForm.jsx` (precios) | `grid-cols-2` fijo; la etiqueta «Precio de oferta (opcional)» se parte en varias líneas y desalinea los inputs en pantallas angostas. | Baja |
| A4 | `Login.jsx`, `ProductForm.jsx` | Inputs con `text-sm` (14 px): iOS Safari hace zoom automático al enfocar un campo menor de 16 px. | Media |
| A5 | `components/admin/AdminNav.jsx` | Enlaces `text-sm` sin padding, alto de toque muy por debajo de 44 px. Sin indicación de la sección activa. | Media |
| A6 | `pages/admin/Dashboard.jsx` | Filas `flex justify-between` sin `gap` ni `min-w-0`: un nombre de producto largo empuja el estado «Agotado / N u.» fuera de la fila. | Baja |
| A7 | `App.jsx` | Las rutas `/admin/*` también renderizan `SiteHeader` público y `SlimFooter`. Verificar que no estorben ni se vean rotos en el admin en móvil (no es estrictamente responsive, pero afecta la composición). | Verificar |

## Hallazgos del sitio público

| # | Archivo | Problema | Severidad | Rama destino |
|---|---|---|---|---|
| P1 | `pages/public/PaymentResult.jsx:53` | `min-h-[calc(100svh-88px)]` resta 88 px siempre, pero el header mide 68 px por debajo de `lg` (`SiteHeader.jsx`, `HEADER_HEIGHT_CLASS`). En móvil y tablet sobran 20 px de scroll. | Baja | `feat/responsive-tablet` |
| P11 | `SiteHeader.jsx`, footers | Íconos del header de 24×24 px y enlaces del footer de 16 px de alto en móvil (medido en navegador). | Media | `fix/responsive-small-screens` |
| P2 | `components/common/SocialDock.jsx` | Íconos de 18 px (26 px con magnificación, que solo existe con mouse). Como objetivo táctil es muy pequeño. | Media | `fix/responsive-small-screens` |
| P3 | `components/cart/CartItem.jsx` | Botones de cantidad `h-8 w-8` (32 px) y enlace «Quitar» de 11 px, por debajo de los 44 px recomendados. | Media | `fix/responsive-small-screens` |
| P4 | Varios (`ProductCard`, `CartToast`, `MobileMenu`, `CollectionCards`) | Muchos textos `font-mono text-[10px]`. Legibilidad justa en móvil. | Baja | `fix/responsive-small-screens` |
| P5 | Breakpoints mezclados | Unos componentes cambian de layout en `md` (768) y otros en `lg` (1024), por ejemplo `HeroCurtain` (`md:sticky md:h-screen`) frente a header, `ProductDetail` y `PaymentResult` (`lg`). Entre 768 y 1023 px conviven layouts de móvil y de escritorio. | Media, verificar | `feat/responsive-tablet` |
| P6 | `components/home/HeroCurtain.jsx:29` | `md:h-screen` usa `100vh`, que en Safari de iPad queda más alto que el área visible por la barra del navegador (ahí lo correcto es `svh`). | Baja, verificar | `feat/responsive-tablet` |
| P7 | `components/home/PosterLookbook.jsx:132` | `min-h-[640px]` con `h-[100svh]`: en un móvil en horizontal (alto ~360 px) la sección supera la ventana. | Baja, verificar | `fix/responsive-small-screens` |
| P9 | General | 44 usos de `hover:` en el código. Verificar la versión de Tailwind: desde v4 `hover:` ya se limita a dispositivos con hover; en v3 en táctil puede quedar el estado «pegado» tras tocar. | Verificar | `fix/responsive-small-screens` |
| P10 | `BrandFrame` / `index.css:93` | Marco fijo de 5 px con `z-index: 60`. El comentario dice «solo escritorio»; verificar que en móvil realmente se oculte y no reste ancho. | Verificar | `feat/responsive-tablet` |

## Plan de ramas resultante

Todas desde `main`. Probar en vivo a 320, 375, 768, 1024 y 1440 px antes de abrir cada PR.

1. `chore/responsive-audit` (esta rama): este documento. Pendiente la pasada visual para confirmar los puntos «verificar».
2. `feat/responsive-admin-shell`: A4, A5, A7 y el `Login`. El `Dashboard` (A6) cabe aquí.
3. `feat/responsive-admin-products`: A1, A2 y A3. Lista de productos como tarjetas en móvil y variantes apiladas.
4. `feat/responsive-tablet`: P1, P5, P6, P8 y P10, según lo que confirme la pasada visual.
5. `fix/responsive-small-screens`: P2, P3, P4, P7 y P9, más una revisión a 320 px y en horizontal.
6. `docs/responsive-checklist`: breakpoints usados y checklist de pruebas en el Manual del Programador. Se puede fusionar con la rama 5 si sale corta.

Las ramas 2 y 3 tocan archivos distintos de la 4 y la 5, por lo que pueden hacerse en paralelo sin conflictos.
