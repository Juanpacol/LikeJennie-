# Manual del Programador — Ruby.

E-commerce de streetwear (Taller II de Programación). Este documento explica cómo está construido, cómo instalarlo y cómo viaja un dato desde la base de datos hasta la pantalla.

## 1. Ficha tecnológica

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 3, React Router 7, Context API |
| Animación e interacción | `motion` (efecto dock), `lenis` (scroll suave), CSS (transiciones, subrayados, brillos) |
| Tipografías (Google Fonts) | Allura (script), Bodoni Moda (títulos y texto de marca), Antonio (titular condensado del hero) y Poppins 800 (`font-heavy`, el título del Lookbook). En la home, las etiquetas pequeñas y los botones van en monoespaciada (`font-mono`) y los títulos de sección en Antonio (`font-condensed`) |
| Backend | Node.js 20, Express 5 |
| Acceso a datos | Prisma ORM 5 |
| Base de datos | PostgreSQL en Supabase (nube) |
| Autenticación admin | JWT (`jsonwebtoken`) + `bcryptjs` |
| Comunicación | JSON exclusivo (`{ success, data }` / `{ success, error }`) |
| Despliegue | Frontend en Vercel, backend en Render, DB en Supabase |
| CI | GitHub Actions (`prisma validate`, `oxlint`, `vite build` en cada PR) |

## 2. Arquitectura

Frontend y backend están separados y solo se hablan por HTTP con JSON.

```
Navegador (React, Vercel)
      │  fetch JSON  (VITE_API_URL)
      ▼
API Express (Render)
  routes → controllers → services → repositories → Prisma
                                                    │
                                                    ▼
                                         PostgreSQL (Supabase)
```

### Capas del backend (`backend/src`)

Cada capa solo llama a la inmediatamente inferior; nunca se salta un nivel.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Routes | `routes/` | Declara endpoints y los asocia a un controller. |
| Controllers | `controllers/` | Lee `req`, llama al service, responde con `ok(res, data)`. |
| Services | `services/` | Lógica de negocio: banderas de stock, validación de órdenes, login. |
| Repositories | `repositories/` | Única capa que usa Prisma (consultas a la DB). |
| Middlewares | `middlewares/` | `auth.middleware` (valida JWT) y `error.middleware` (formato de errores). |
| Utils | `utils/` | `asyncHandler`, errores tipados (`NotFoundError`, `BadRequestError`), JWT, `ok()`. |

### Estructura del frontend (`frontend/src`)

- `pages/public`: Home, Catalog, Collection, ProductDetail. `pages/admin`: Login, Dashboard, Products, ProductForm.
- `components/` agrupados por dominio:
  - `common`: `SiteHeader`, `Footer`, `FooterReveal`, `MobileMenu`, `BrandFrame`, `SmoothScroll`, `Dock`, `SocialDock`.
  - `home`: `JennieHero`, `CollectionCards`, `ShopTabs`, `FaqSection`.
  - `product`, `cart` (`CartDrawer`, `CartItem`, `CartToast`), `account`, `search`, `admin`, `icons`.
- `context/`: `CartContext` (carrito y último producto agregado), `AuthContext` (token admin), `AccountPanelContext` (panel de cuenta).
- `data/`: `collections.js` (colecciones y su tema), `faqs.js`, `socialLinks.js`.
- `utils/`: `formatPrice`, `slugify`, `brandTheme` (colores de la marca por ruta).
- `services/`: una función por llamada a la API sobre `api.js`, que añade la URL base y desenvuelve `data`.

## 3. Modelo de datos

Definido en `backend/prisma/schema.prisma` (detalle en `docs/specs/data-model.spec.md`).

| Tabla | Campos clave | Relaciones |
|---|---|---|
| `categories` | `name`, `slug` (único) | 1—N `products` |
| `products` | `name`, `slug` (único), `description`, `basePrice`, `salePrice?`, `isActive` | N—1 `categories`; 1—N `product_variants` y `product_images` |
| `product_variants` | `size`, `color`, `stock`, `sku` (único) | N—1 `products` (borrado en cascada) |
| `product_images` | `url`, `position` | N—1 `products` (cascada) |
| `admin_users` | `email` (único), `passwordHash`, `name` | — |
| `orders` | `customerName`, `customerEmail`, `status` (`PENDING`/`COMPLETED`/`CANCELLED`), `total` | 1—N `order_items` |
| `order_items` | `quantity`, `unitPrice` | N—1 `orders` (cascada); N—1 `product_variants` (restringe borrado) |

Decisiones: cada prenda tiene variantes talla + color, cada una con su propio stock; las imágenes se guardan solo como URL (sin subida de archivos); `unitPrice` fija el precio al momento de la compra.

## 4. Endpoints

Todas las respuestas son JSON. Éxito: `{ "success": true, "data": ... }`. Error: `{ "success": false, "error": "mensaje" }`.

### Públicos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servicio. |
| GET | `/api/categories` | Lista de categorías. |
| GET | `/api/products?category=<slug>` | Catálogo de productos activos, con imágenes, variantes y banderas `isLowStock` / `isOutOfStock`. |
| GET | `/api/products/:slug` | Detalle de un producto (404 si no existe o está inactivo). |
| POST | `/api/orders` | Crea una orden. Cuerpo: `{ customerName, customerEmail, items: [{ variantId, quantity }] }`. Valida stock, fija precios y descuenta inventario. |

### Admin (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/admin/auth/login` | Cuerpo `{ email, password }`; devuelve `{ token, user }`. El token dura 1 día. |
| GET | `/api/admin/dashboard` | Conteos y listas: productos activos, stock bajo, órdenes recientes. |
| GET | `/api/admin/products` | Todos los productos (activos e inactivos). |
| GET | `/api/admin/products/:id` | Un producto por id. |
| POST | `/api/admin/products` | Crea producto con `images` y `variants` anidadas. |
| PUT | `/api/admin/products/:id` | Actualiza un producto. |
| DELETE | `/api/admin/products/:id` | Elimina un producto (cascada a variantes e imágenes). |
| GET | `/api/admin/stock/low` | Variantes con stock igual o menor al mínimo (incluye agotadas). |
| PUT | `/api/admin/variants/:variantId/stock` | Cuerpo `{ stock }`; ajusta el stock de una variante. |
| GET | `/api/admin/orders` | Lista de órdenes. |

Códigos de error: 400 (solicitud inválida, p. ej. carrito vacío, stock insuficiente, credenciales inválidas), 401 (sin token o token inválido), 404 (recurso inexistente), 500 (error interno sin detalles).

Regla de stock: `STOCK_MINIMO = 5` (`backend/src/constants/stock.constants.js`). La bandera `isLowStock` aplica con stock entre 1 y 5, e `isOutOfStock` con 0. El endpoint `/api/admin/stock/low` y el dashboard listan todas las variantes con stock ≤ 5, incluidas las agotadas.

## 5. Flujo de datos de extremo a extremo

### 5.1 Catálogo: de la DB a la pantalla

1. El usuario abre `/catalogo`; `StoreGrid` llama a `getCatalog()` (`services/product.service.js`).
2. `api.js` hace `fetch(VITE_API_URL + "/products")`.
3. Express enruta `GET /api/products` a `product.controller.getCatalog`.
4. El controller llama a `productService.getCatalog()`.
5. El service pide `productRepo.findMany({ onlyActive: true })` y añade `isLowStock` / `isOutOfStock` a cada variante.
6. El repository ejecuta `prisma.product.findMany` con `include` de categoría, imágenes y variantes → SQL contra Supabase.
7. El resultado sube por las capas hasta `ok(res, products)` → `{ success: true, data: [...] }`.
8. `api.js` devuelve `body.data`; `StoreGrid` guarda el arreglo en estado y renderiza una `ProductCard` por producto (mostrando "Agotado" si todas las variantes lo están).

### 5.2 Compra simulada

1. En el detalle el usuario elige talla y color (`VariantSelector`) y agrega al carrito; `CartContext` guarda ítems en memoria.
2. En `CartDrawer`, "Finalizar compra" pide nombre y email y llama a `POST /api/orders` con `variantId` y `quantity` de cada ítem.
3. `order.service.createOrder` valida que haya ítems, busca cada variante, verifica stock, toma `salePrice ?? basePrice` como precio unitario y calcula el total.
4. Descuenta el stock de cada variante y crea `orders` + `order_items`.
5. El carrito se vacía y se muestra la confirmación. Si el stock no alcanza, el error 400 llega al drawer y se muestra en línea.

### 5.3 Panel admin

1. `POST /api/admin/auth/login` compara el password con `bcrypt.compare`; si coincide, firma un JWT.
2. El frontend guarda el token en `localStorage` (`ruby_admin_token`) vía `AuthContext`.
3. `ProtectedRoute` redirige al login si no hay token; las llamadas admin envían `Authorization: Bearer <token>`.
4. `auth.middleware` verifica el token en cada petición a `/api/admin/*`.

## 6. Instalación local

Requisitos: Node.js 20+, una base PostgreSQL (la de Supabase del proyecto) y su cadena de conexión.

**Backend**
```bash
cd backend
npm install
cp .env.example .env      # completar DATABASE_URL y JWT_SECRET
npx prisma migrate dev    # aplica el esquema
npx prisma db seed        # datos de prueba + admin de prueba
node server.js            # http://localhost:4000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:4000/api
npm run dev               # http://localhost:5173
```

Variables de entorno:

| Variable | Dónde | Uso |
|---|---|---|
| `DATABASE_URL` | backend | Conexión a PostgreSQL. |
| `JWT_SECRET` | backend | Firma de los JWT. Debe ser largo y aleatorio. |
| `PORT` | backend | Puerto (por defecto 4000; Render lo define). |
| `VITE_API_URL` | frontend | URL base de la API; se incorpora al compilar. |

## 7. Interfaz y efectos (frontend)

Todo el movimiento respeta `prefers-reduced-motion: reduce` (CSS en `index.css`, y `useReducedMotion` de `motion` en el dock). Los efectos se inspiraron en la página de Hermes Agent y se reimplementaron con código propio.

| Pieza | Archivo | Qué hace |
|---|---|---|
| Header de tres zonas | `SiteHeader.jsx` | Cuadrícula `1fr auto 1fr`: secciones a los lados, logo al centro con las redes debajo (`SocialDock`). Desde 1024 px; por debajo, hamburguesa a la izquierda y logo al centro. En la landing va superpuesto al hero y, al pasar el 85 % del alto de la ventana, baja un header compacto; en las demás rutas es fijo y se compacta tras 40 px de scroll. Un espaciador (84 px / 127 px) evita que el contenido se tape. |
| Menú móvil | `MobileMenu.jsx` | Panel lila desde la izquierda, en un portal en `document.body` (el header usa `backdrop-filter`, que atraparía a un panel `fixed` dentro). |
| Dock | `Dock.jsx`, `SocialDock.jsx` | Efecto de lupa tipo macOS con `motion`: `Dock`/`DockIcon` para íconos y `DockText` para letras (escala, sin mover el layout). |
| Scroll suave | `SmoothScroll.jsx` | Lenis con `lerp: 0.09`; no se activa con reducir movimiento. Las zonas con scroll propio llevan `data-lenis-prevent`. Al cambiar de ruta vuelve arriba. |
| Footer delgado | `SlimFooter.jsx` | Franja de ~116 px (marca, enlaces y `SocialDock`) para todas las rutas que no son la landing, incluido `/admin`; `App.jsx` decide con `isLanding`. |
| Footer revelado | `FooterReveal.jsx`, `Footer.jsx` | El footer queda `fixed` detrás del contenido (`main` con `z-10` y fondo propio) y `FooterReveal` escribe `--footer-progress` (0 a 1) en cada scroll; el footer pasa de `blur(10px)` y opacidad 0 a nítido y completo. Solo en la landing, desde 768 px y si el footer cabe en la ventana. |
| Marco y barra del navegador | `BrandFrame.jsx`, `utils/brandTheme.js` | Borde fijo de 5 px (solo desde 768 px, sin capturar clics) con un brillo que se desliza; y `<meta name="theme-color">` actualizada por ruta. El color es rojo ruby (`#D6001C`) o el de la colección en `/colecciones/:slug`. |
| Detalle de producto | `ProductDetail.jsx`, `ImageLightbox.jsx`, `VariantSelector.jsx` | Cuadrícula `1fr 26rem`: galería de una foto a la vez, siempre completa (`object-contain`): en escritorio las fotos se apilan con fundido y el mouse elige la activa según su posición horizontal (`handleStageMove`; vuelve a la primera al salir); en móvil es una tira con `scroll-snap` de una foto por pantalla cuyo índice sigue al deslizamiento. Sin avance automático. Puntos clicables abajo a la derecha y columna de compra negra (`#0d0d0d`) con talla, cantidad y botón rojo. `ImageLightbox` es el visor (portal, teclado ← → Esc). Las tallas sin existencias para el color elegido salen tachadas y deshabilitadas; arranca en la primera variante con stock. |
| Hero | `JennieHero.jsx`, `index.css` | Inspirado en offform.net: las tres fotos (`hero-left/center/right.jpg`, con su `position` de encuadre) ocupan toda la sección en una cuadrícula de 3 columnas y se revelan de arriba hacia abajo con `clip-path` (0,65 s, escalonado). Encima, un degradado oscuro, el titular condensado (Antonio), la etiqueta en monoespaciada y el botón **Ver tienda**. No repite las colecciones ni las categorías, que ya están en las secciones de abajo y en el menú. |
| Lookbook tipo póster | `PosterLookbook.jsx`, `assets/cutouts/*.webp` | Sección de pantalla completa (`h-screen`) en versión clara (fondo `#e9e9e9`, tipografía negra), en capas de atrás hacia delante: luz suave, título en dos líneas alineado a la izquierda (**«Idol»** y **«JENNIE»** en Bodoni Moda 600; la «I» con serifas se distingue de la «l»), **RUBY** negro en el suelo (perspectiva con `rotateX` y `rotateZ`, cortado por los bordes), el texto «Lookbook», la lista vertical «In my Ruby era» (con «Ruby» en el rojo de acento) y tres figuras recortadas en blanco y negro con sombra suave que se montan sobre el título. Cada capa usa el componente `Layer`: entra subiendo, se desplaza con el mouse a distinta velocidad (`depth`) y, con `useScroll`, sube a su propio ritmo al hacer scroll (`rise`). |
| Tarjetas de colecciones | `CollectionCards.jsx`, `data/collections.js` | Una tarjeta 4:5 por colección con su foto (`bannerImage` o `image`, con `bannerPosition`/`imagePosition`); tres lado a lado desde `md` y tira con `scroll-snap` en móvil. Al hover, zoom y sube la frase con el botón (solo con `hover: hover`). |
| Tienda con pestañas | `ShopTabs.jsx` | Pestañas Todo y una por categoría con 4 productos (`ProductCard`). Carga categorías y catálogo una vez y filtra en el cliente; «Todo» muestra un producto de cada categoría. «Ver todo» enlaza a `/catalogo?categoria=…`. |
| FAQs (3 preguntas) | `FaqSection.jsx`, `data/faqs.js` | Acordeón accesible (`aria-expanded`), animación de altura con `grid-template-rows`. |
| Cabecera de colección | `CollectionBanner.jsx`, `data/collections.js` | Texto a la izquierda y la foto de la colección a la derecha (`bannerImage`, o `image` si falta; `bannerPosition` elige el encuadre), fundida con el fondo mediante una máscara degradada (sirve con cualquier color). La foto entra con `animate-banner-in` (zoom que se asienta, 1,4 s) y se desplaza al hacer scroll más despacio que la página (parallax, 18 %); sin parallax con reducir movimiento. En móvil la foto va de fondo atenuada. |
| Frases | `data/phrases.js`, `data/collections.js`, `Collection.jsx`, `CartDrawer.jsx` | `ORDER_PHRASE` se muestra en script al confirmar un pedido; cada colección tiene su `phrase`, que aparece bajo su descripción entre dos líneas finas. Los textos actuales son de ejemplo y se editan en esos dos archivos. |
| Aviso al agregar | `CartToast.jsx`, `CartContext.jsx` | `addItem` guarda `lastAdded`; el aviso entra por la derecha y se cierra a los 4 s. `addItem` ya **no abre** el carrito. |
| Buscador | `SearchPanel.jsx` | Carga el catálogo una vez y filtra por nombre en el cliente (hasta 5 resultados). También en un portal. |
| Clases de CSS | `index.css` | `.hover-underline` y `.group-hover-underline` (línea que se dibuja), `.btn-sweep` (brillo que barre el botón) y `.brand-frame`. Las animaciones `toast-in`, `toast-out` y `slide-in-left` están en `tailwind.config.js`. |

**Paleta.** Negro como base, rojo ruby `#D6001C` como acento y lila (`lilac` `#D9C8E0`, `lilac-deep` `#24102F`) para los paneles; cada colección define la suya en `data/collections.js`.

**Dependencias nuevas del frontend:** `motion` y `lenis`.

## 8. Despliegue

Ver la sección *Despliegue* del `README.md`. En resumen: `render.yaml` define el servicio del backend (build con `npm ci && npx prisma migrate deploy`), Vercel construye el frontend desde `frontend/`, y ambos se redespliegan solos con cada push a `main`.

## 9. Scripts de datos y colecciones

Los scripts viven en `backend/prisma/scripts/` y se ejecutan a mano desde `backend/` (modifican la base a la que apunte `DATABASE_URL`).

| Script | Uso |
|---|---|
| `restructure-categories.js` | Deja las categorías como Ropa, Abrigos, Accesorios y Música (renombra o fusiona las anteriores). |
| `import-catalog.js <archivo.json> [--dry-run]` | Importa productos desde `prisma/data/catalog-*.json`. Omite los que ya existen por slug o nombre; `--dry-run` solo lista lo que haría. |
| `deactivate-placeholder-products.js [--dry-run]` | Oculta (`isActive = false`) los productos de relleno con imagen de `picsum.photos`. |

**Recortes de fotos (frontend).** `frontend/src/assets/cutouts/` guarda PNG con fondo transparente de cuatro fotos (`hero-left`, `hero-center`, `hero-right`, `footer-stage`). Se generan con `sh scripts/make-cutouts.sh <carpeta con las fotos originales>` desde `frontend/`: `cutout.swift` usa el recorte de sujeto de Apple (Vision, macOS 14+, local, sin descargas) y `clean-cutouts.py` (Pillow) borra con polígonos lo que Vision une a la persona (una cortina, otra bailarina) y contrae unos píxeles el borde para quitar el halo del fondo original. Aún no se usan en ninguna página.

Los JSON de `prisma/data/` salen del catálogo de la tienda de referencia: precios convertidos a COP (£ × 2.200, redondeado al millar), imágenes solo por URL y variantes por talla con color "Único".

**Colecciones.** No existe un modelo en la base: `frontend/src/data/collections.js` define cada colección (título, descripción, tema de color y un texto `match`), y un producto pertenece a ella si su nombre contiene ese texto. La home dibuja una banda por colección y `/colecciones/:slug` lista sus productos. Para añadir una colección basta una entrada nueva en ese archivo.

**Orden de categorías.** `frontend/src/services/category.service.js` ordena las categorías (Ropa, Abrigos, Accesorios, Música) para el menú, el footer y los filtros.

## 10. Flujo de trabajo y calidad

- Nada se commitea directo en `main`: cada cambio va en su rama (`feat/...`, `fix/...`, `docs/...`), se prueba contra el backend y la DB reales y entra por Pull Request.
- El CI valida cada PR: `prisma validate` en el backend y `oxlint` + `vite build` en el frontend.
- Convención de commits: `tipo(ámbito): descripción` (`feat`, `fix`, `chore`, `docs`).
