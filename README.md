# LikeJennie-

E-commerce full-stack de ropa/streetwear, proyecto académico (Taller II de Programación - Ingeniería Informática, Politécnico Colombiano Jaime Isaza Cadavid).

## Stack

- **Backend:** Node.js + Express (arquitectura en capas)
- **Base de datos:** Supabase (PostgreSQL) + Prisma ORM
- **Frontend:** React + Vite
- **Comunicación:** JSON exclusivo entre cliente y servidor
- **Deploy:** Backend en Render, Frontend en Vercel, DB en Supabase

## Estructura del proyecto

```
LikeJennie-/
├── backend/
│   ├── src/
│   │   ├── config/        # conexión DB, variables de entorno
│   │   ├── routes/        # definición de endpoints
│   │   ├── controllers/   # maneja request/response
│   │   ├── services/      # lógica de negocio
│   │   ├── repositories/  # única capa que habla con Prisma/DB
│   │   ├── dtos/          # forma de los objetos JSON
│   │   ├── validators/    # validación de inputs
│   │   ├── middlewares/   # auth, upload, manejo de errores
│   │   ├── utils/         # helpers (jwt, respuestas estándar)
│   │   ├── constants/     # valores fijos (ej: stock mínimo)
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── pages/         # vistas (público y admin)
│       ├── components/    # piezas reutilizables
│       ├── services/      # llamadas a la API
│       ├── hooks/         # lógica reutilizable
│       ├── context/       # estado global (carrito, auth)
│       ├── routes/        # definición de rutas del front
│       └── utils/
│
└── docs/
    ├── manual-usuario.md
    └── manual-programador.md
```

Regla de capas en el backend: cada capa solo llama a la inmediatamente inferior (route → controller → service → repository → DB). Nunca se salta un nivel.

## Módulos funcionales

- **Público:** catálogo, filtros por categoría/talla/color, detalle de producto, carrito de compras
- **Admin:** CRUD de productos (imagen, precio, stock, descripción), alertas de stock mínimo, dashboard

## Estado actual

Estructura de carpetas definida. Código en desarrollo.
