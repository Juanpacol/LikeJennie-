# Manual del Programador — Ruby.

E-commerce de streetwear (Taller II de Programación). Este documento explica cómo está construido, cómo instalarlo y cómo viaja un dato desde la base de datos hasta la pantalla.

## 1. Ficha tecnológica

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 3, React Router 7, Context API |
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

- `pages/public` (Home, Catalog, Collection, ProductDetail) y `pages/admin` (Login, Dashboard, Products, ProductForm).
- `components/` agrupados por dominio: `common` (SiteHeader, Footer), `product`, `cart`, `account`, `search`, `home`, `admin`, `icons`.
- `context/`: `CartContext` (carrito), `AuthContext` (token admin), `AccountPanelContext` (panel de cuenta).
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

## 7. Despliegue

Ver la sección *Despliegue* del `README.md`. En resumen: `render.yaml` define el servicio del backend (build con `npm ci && npx prisma migrate deploy`), Vercel construye el frontend desde `frontend/`, y ambos se redespliegan solos con cada push a `main`.

## 8. Scripts de datos y colecciones

Los scripts viven en `backend/prisma/scripts/` y se ejecutan a mano desde `backend/` (modifican la base a la que apunte `DATABASE_URL`).

| Script | Uso |
|---|---|
| `restructure-categories.js` | Deja las categorías como Ropa, Abrigos, Accesorios y Música (renombra o fusiona las anteriores). |
| `import-catalog.js <archivo.json> [--dry-run]` | Importa productos desde `prisma/data/catalog-*.json`. Omite los que ya existen por slug o nombre; `--dry-run` solo lista lo que haría. |
| `deactivate-placeholder-products.js [--dry-run]` | Oculta (`isActive = false`) los productos de relleno con imagen de `picsum.photos`. |

Los JSON de `prisma/data/` salen del catálogo de la tienda de referencia: precios convertidos a COP (£ × 2.200, redondeado al millar), imágenes solo por URL y variantes por talla con color "Único".

**Colecciones.** No existe un modelo en la base: `frontend/src/data/collections.js` define cada colección (título, descripción, tema de color y un texto `match`), y un producto pertenece a ella si su nombre contiene ese texto. La home dibuja una banda por colección y `/colecciones/:slug` lista sus productos. Para añadir una colección basta una entrada nueva en ese archivo.

**Orden de categorías.** `frontend/src/services/category.service.js` ordena las categorías (Ropa, Abrigos, Accesorios, Música) para el menú, el footer y los filtros.

## 9. Flujo de trabajo y calidad

- Nada se commitea directo en `main`: cada cambio va en su rama (`feat/...`, `fix/...`, `docs/...`), se prueba contra el backend y la DB reales y entra por Pull Request.
- El CI valida cada PR: `prisma validate` en el backend y `oxlint` + `vite build` en el frontend.
- Convención de commits: `tipo(ámbito): descripción` (`feat`, `fix`, `chore`, `docs`).
