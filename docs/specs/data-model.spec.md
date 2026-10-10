# Spec — Modelo de datos (capa de persistencia)

## Objetivo

Definir las entidades, campos y relaciones necesarias para cubrir los requisitos del taller: catálogo con filtros, variantes de producto con stock individual, alertas de stock mínimo, carrito/orden simulada y acceso admin protegido. Esta spec es la base del diagrama Entidad-Relación del Manual del Programador.

## Entidades

### Category
Agrupa productos para los filtros del catálogo público.
- `id` (PK)
- `name`
- `slug` (único, usado en URLs/filtros)
- `createdAt`, `updatedAt`

### Product
Representa una prenda del catálogo.
- `id` (PK)
- `name`
- `slug` (único)
- `description`
- `basePrice` (Decimal) — precio regular
- `salePrice` (Decimal, opcional) — precio de oferta, si existe se muestra junto al regular
- `categoryId` (FK → Category)
- `isActive` (Boolean) — controla si aparece en catálogo público y en el conteo del dashboard admin
- `createdAt`, `updatedAt`
- Relaciones: 1 a muchos con `ProductVariant` y `ProductImage`

### ProductVariant
Unidad real de inventario: cada combinación talla+color tiene su propio stock.
- `id` (PK)
- `productId` (FK → Product, `onDelete: Cascade`)
- `size`
- `color`
- `stock` (Int)
- `sku` (único)
- Por qué: el requisito de "alertas de stock mínimo" solo tiene sentido evaluado por variante — una camiseta puede tener talla M agotada y L disponible al mismo tiempo.

### ProductImage
Galería de imágenes de un producto.
- `id` (PK)
- `productId` (FK → Product, `onDelete: Cascade`)
- `url`
- `position` (Int) — orden de la galería
- Por qué separarla de `Product`: permite múltiples fotos por producto sin repetir filas ni usar un array JSON poco consultable.

### AdminUser
Usuario que accede al panel administrativo.
- `id` (PK)
- `email` (único)
- `passwordHash`
- `name`
- `createdAt`, `updatedAt`
- Un único rol (admin) — el taller no pide multi-rol, agregarlo sería sobrediseño.

### Order
Representa el simulacro de compra del módulo público.
- `id` (PK)
- `customerName`
- `customerEmail`
- `status` (enum: `PENDING`, `COMPLETED`, `CANCELLED`)
- `total` (Decimal)
- `createdAt`
- Relación: 1 a muchos con `OrderItem`

### OrderItem
Línea de una orden.
- `id` (PK)
- `orderId` (FK → Order, `onDelete: Cascade`)
- `variantId` (FK → ProductVariant, `onDelete: Restrict`) — no se puede borrar una variante con historial de ventas
- `quantity` (Int)
- `unitPrice` (Decimal) — copia del precio al momento de la compra, no se recalcula si el producto cambia de precio después

## Diagrama de relaciones

```
Category 1───N Product 1───N ProductVariant 1───N OrderItem N───1 Order
                    │
                    └──N ProductImage

AdminUser (sin relación con el catálogo — solo autenticación del panel)
```

## Fuera de alcance (justificación de no sobrediseñar)

No se incluyen: reviews, wishlists, cupones/descuentos globales, multi-moneda, multi-rol de usuario. Ninguno es requisito del taller.
