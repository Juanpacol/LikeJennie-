# Ruby. (LikeJennie-)

E-commerce full-stack de ropa/streetwear, proyecto académico (Taller II de Programación - Ingeniería Informática, Politécnico Colombiano Jaime Isaza Cadavid).

## Stack

- **Backend:** Node.js + Express (arquitectura en capas)
- **Base de datos:** Supabase (PostgreSQL) + Prisma ORM
- **Frontend:** React + Vite + Tailwind CSS, React Router, Context API (carrito y sesión admin); `motion` (efecto dock) y `lenis` (scroll suave)
- **Comunicación:** JSON exclusivo entre cliente y servidor
- **Auth admin:** JWT (jsonwebtoken) + bcryptjs
- **Deploy:** Backend en Render, Frontend en Vercel, DB en Supabase — ver sección Despliegue

## Estructura del proyecto

```
LikeJennie-/
├── backend/
│   ├── src/
│   │   ├── config/        # conexión a Prisma
│   │   ├── routes/        # definición de endpoints (públicos y /admin)
│   │   ├── controllers/   # maneja request/response
│   │   ├── services/      # lógica de negocio (catálogo, stock, órdenes, auth, dashboard)
│   │   ├── repositories/  # única capa que habla con Prisma/DB
│   │   ├── middlewares/   # auth (JWT), manejo de errores
│   │   ├── utils/         # jwt, respuestas estándar, asyncHandler, errores tipados
│   │   ├── constants/     # valores fijos (stock mínimo)
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js        # datos de prueba + admin de prueba
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── public/     # Home, Catalog, ProductDetail
│       │   └── admin/      # Login, Dashboard, Products, ProductForm
│       ├── components/
│       │   ├── common/     # SiteHeader, Footer, FooterReveal, MobileMenu, BrandFrame, Dock, SmoothScroll
│       │   ├── home/       # JennieHero, PromoBand, CategoryCards, FeaturedProducts, FaqSection
│       │   ├── search/     # SearchPanel
│       │   ├── account/    # AccountPanel
│       │   ├── product/    # ProductCard, FilterBar, VariantSelector
│       │   ├── cart/       # CartDrawer, CartItem, CartToast
│       │   └── admin/      # AdminNav, StatCard, ProtectedRoute
│       ├── context/        # CartContext, AuthContext, AccountPanelContext
│       ├── data/           # collections, faqs, socialLinks
│       ├── services/       # llamadas a la API (api.js + uno por recurso)
│       ├── utils/          # formatPrice, slugify
│       └── App.jsx         # routing (React Router)
│
└── docs/
    ├── manual-usuario.md       # Manual de Usuario (no técnico)
    ├── manual-programador.md   # Manual del Programador
    └── specs/
        └── data-model.spec.md
```

Regla de capas en el backend: cada capa solo llama a la inmediatamente inferior (route → controller → service → repository → DB). Nunca se salta un nivel.

## Módulos funcionales

- **Público:** landing con hero, colecciones, categorías y FAQs; catálogo dinámico con filtros por categoría; colecciones con su paleta; buscador; detalle de producto con galería y selector de talla/color; carrito con aviso animado y checkout simulado (`POST /api/orders`); menú móvil
- **Admin:** login JWT, dashboard con métricas reales (productos activos, stock bajo/agotado, órdenes recientes), CRUD completo de productos (incluye variantes y stock), alertas de stock mínimo

## Desarrollo local

**Backend:**
```bash
cd backend
npm install
cp .env.example .env     # completar DATABASE_URL (Supabase) y JWT_SECRET
npx prisma migrate dev
npx prisma db seed
node server.js            # http://localhost:4000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env     # ajustar VITE_API_URL si el backend corre en otro puerto
npm run dev                # http://localhost:5173
```

Credenciales de admin de prueba: ver salida de `npx prisma db seed` (se generan en `backend/prisma/seed.js`).

## Despliegue

El despliegue es automático: cada push a `main` redespliega ambos servicios desde GitHub (sin workflow propio; el CI de `.github/workflows/ci.yml` solo valida los PR).

**Backend (Render)**
1. Render > New > Blueprint, conectar este repo. Lee `render.yaml` y crea el servicio `ruby-api`.
2. Cargar en el panel las variables `DATABASE_URL` (cadena de Supabase) y `JWT_SECRET` (valor aleatorio largo).
3. Con Supabase usar la cadena del *Session pooler* (puerto 5432): la conexión directa es solo IPv6 y Render no la alcanza.
4. Verificar `https://ruby-api-cf12.onrender.com/api/health` (responde `ok`).

**Frontend (Vercel)**
1. Proyecto con *Root Directory* `frontend`; el build usa `vite build`.
2. Definir `VITE_API_URL` = `https://ruby-api-cf12.onrender.com/api` (Production y Preview) y redesplegar: Vite incorpora la variable al compilar.

**URLs en producción:** sitio `https://like-jennie-seven.vercel.app` · API `https://ruby-api-cf12.onrender.com/api`. El plan gratuito de Render duerme el servicio tras un rato sin tráfico: la primera petición puede tardar 30–60 s.

## Flujo de trabajo del repo

Nada se commitea directo en `main`. Cada feature vive en su propia rama (`feature/...`), se prueba contra el backend/DB real, se abre PR, y se mergea desde ahí.

## Estado actual

Backend y frontend funcionales de punta a punta, probados en vivo contra Supabase (sin mocks): modelo de datos, API pública y admin, catálogo, carrito/checkout, panel admin con auth/dashboard/CRUD.

## Documentación

- [Manual de Usuario](docs/manual-usuario.md): cómo comprar y cómo administrar la tienda (no técnico).
- [Manual del Programador](docs/manual-programador.md): arquitectura, modelo de datos, endpoints, flujo de datos, instalación, interfaz y despliegue.

Pendiente: capturas de pantalla para el Manual de Usuario.
