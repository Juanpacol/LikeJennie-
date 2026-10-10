# Contexto del proyecto — Ruby. (LikeJennie-)

## Qué es

Proyecto final de Taller II de Programación (Ingeniería Informática, Politécnico Colombiano Jaime Isaza Cadavid). Entrega: E-commerce full-stack funcional, desplegado en internet, con documentación técnica y de usuario.

Nicho: tienda de ropa/streetwear, con estética inspirada en el estilo de la artista Jennie. **Nombre de marca definido: `Ruby.`** — se descartó usar "LikeJennie" o "ODDI." como marca visible en el sitio: el nombre real de la artista no se usa como marca pública por riesgo de marca registrada/derechos de imagen en un deploy accesible por URL. El repo se llama `LikeJennie-` solo como nombre de repositorio personal, no es la marca del sitio.

## Requisitos obligatorios del taller (fuente: Final_taller_2.docx)

- Arquitectura separada Frontend/Backend
- Backend: Node.js + Express
- Comunicación cliente-servidor: JSON exclusivo
- Base de datos: relacional o no relacional, alojada en la nube
- Deploy accesible públicamente (no solo local)
- Módulo público: catálogo dinámico, filtros por categoría, detalle de producto, carrito de compras
- Módulo admin: CRUD completo de productos (imagen, precio, stock, descripción), alertas de stock mínimo, dashboard con resumen
- Entregables: Manual de Usuario (no técnico) + Manual del Programador (arquitectura, modelo de datos, endpoints, instalación local, ficha tecnológica)
- Criterio de evaluación clave: código limpio, modular, bien comentado, y capacidad de argumentar el flujo de datos de extremo a extremo (DB → pantalla)

## Decisiones técnicas tomadas

- **Backend:** Node.js + Express, arquitectura en capas estricta (routes → controllers → services → repositories → DB). Cada capa solo llama a la inmediatamente inferior.
- **Base de datos:** Supabase (PostgreSQL), accedida vía Prisma ORM. Supabase se usa solo como motor de base de datos en la nube — el backend propio en Express expone la API, no el cliente directo de Supabase ni PostgREST.
- **Auth admin:** JWT (`jsonwebtoken`) + `bcryptjs` para hash de password. Token guardado en `localStorage` del frontend (`ruby_admin_token`).
- **Frontend:** React + Vite + Tailwind CSS. React Router para rutas, Context API para estado global (`CartContext`, `AuthContext`) — sin Redux, no hace falta para este tamaño.
- **Variantes de producto:** cada prenda tiene variantes por talla + color, cada una con su propio stock — justifica la funcionalidad de "alertas de stock mínimo" del taller.
- **Imágenes de producto:** solo por URL (sin subida de archivo real / Cloudinary / multer) — decisión consciente para no sumar dependencias externas a mitad de proyecto; el taller solo pide "campo de imagen", no upload real.
- **Deploy (pendiente):** Backend en Render, Frontend en Vercel, DB ya en la nube en Supabase.

## Flujo de trabajo del repo

- **Nada se commitea directo en `main`.** Cada feature va en su propia rama (`feature/...`, `chore/...`), se prueba en vivo (no mocks) y se abre PR antes de mergear.
- Al cerrar cada capa importante, se prueba contra el backend/DB real (curl y/o navegador vía Claude in Chrome) antes de dar la PR por terminada.

## Estado actual

Backend y frontend completos y probados de punta a punta contra Supabase real (sin mocks):

- **Datos:** `schema.prisma` (Category, Product, ProductVariant, ProductImage, AdminUser, Order, OrderItem) + seed con productos y admin de prueba.
- **Backend:** repositories → services → controllers → routes. API pública (`/api/categories`, `/api/products`, `/api/orders`) y API admin protegida por JWT (`/api/admin/*`: auth, CRUD de productos, stock bajo, dashboard, órdenes).
- **Frontend:** scaffold Vite+Tailwind, catálogo con filtros, detalle de producto con selector de variante, carrito con checkout simulado, panel admin (login, dashboard con métricas reales, CRUD de productos con edición de stock por variante).

Pendiente:
- Despliegue real (Render + Vercel).
- Documentación de entrega: Manual de Usuario y Manual del Programador (`docs/`).

## Preferencias de trabajo para este proyecto

- Avanzar despacio, capa por capa, no generar todo de golpe. Cada PR se prueba en vivo antes de darla por lista.
- Código lo más simple y limpio posible — priorizar legibilidad sobre abstracciones innecesarias; no sumar funcionalidad no pedida por el taller (ej: sin reviews, wishlists, multi-rol, multi-moneda).
- No usar el nombre/imagen real de la artista Jennie como marca del proyecto desplegado; la marca pública es `Ruby.`.
- **Nunca usar `window.confirm`/`window.alert`/`window.prompt` en el frontend** — bloquean el hilo del navegador (rompió una sesión de automatización con Claude in Chrome). Usar confirmación/errores inline en el propio componente, como en `Products.jsx`.
