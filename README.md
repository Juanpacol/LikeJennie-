# Ruby. (LikeJennie-)

E-commerce full-stack de ropa/streetwear, proyecto académico (Taller II de Programación - Ingeniería Informática, Politécnico Colombiano Jaime Isaza Cadavid).

## Stack

- **Backend:** Node.js + Express (arquitectura en capas)
- **Base de datos:** Supabase (PostgreSQL) + Prisma ORM
- **Frontend:** React + Vite + Tailwind CSS, React Router, Context API (carrito y sesión admin)
- **Comunicación:** JSON exclusivo entre cliente y servidor
- **Auth admin:** JWT (jsonwebtoken) + bcryptjs
- **Deploy:** pendiente — Backend en Render, Frontend en Vercel, DB ya en Supabase

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
│       │   ├── common/     # Navbar, Footer
│       │   ├── product/    # ProductCard, FilterBar, VariantSelector
│       │   ├── cart/       # CartDrawer, CartItem
│       │   └── admin/      # AdminNav, StatCard, ProtectedRoute
│       ├── context/        # CartContext, AuthContext
│       ├── services/       # llamadas a la API (api.js + uno por recurso)
│       ├── utils/          # formatPrice, slugify
│       └── App.jsx         # routing (React Router)
│
└── docs/
    └── specs/
        └── data-model.spec.md
```

Regla de capas en el backend: cada capa solo llama a la inmediatamente inferior (route → controller → service → repository → DB). Nunca se salta un nivel.

## Módulos funcionales

- **Público:** catálogo dinámico con filtros por categoría, detalle de producto con selector de talla/color, carrito de compras con checkout simulado (`POST /api/orders`)
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

## Flujo de trabajo del repo

Nada se commitea directo en `main`. Cada feature vive en su propia rama (`feature/...`), se prueba contra el backend/DB real, se abre PR, y se mergea desde ahí.

## Estado actual

Backend y frontend funcionales de punta a punta, probados en vivo contra Supabase (sin mocks): modelo de datos, API pública y admin, catálogo, carrito/checkout, panel admin con auth/dashboard/CRUD.

Pendiente: despliegue real (Render + Vercel) y documentación de entrega (Manual de Usuario + Manual del Programador).
