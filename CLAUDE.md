# Contexto del proyecto — LikeJennie-

## Qué es

Proyecto final de Taller II de Programación (Ingeniería Informática, Politécnico Colombiano Jaime Isaza Cadavid). Entrega: E-commerce full-stack funcional, desplegado en internet, con documentación técnica y de usuario.

Nicho elegido: tienda de ropa/streetwear, nombre con flow inspirado en el estilo de la artista Jennie (sin usar su nombre/imagen real como marca, por riesgo de marca registrada/derechos de imagen en un deploy público). Nombres candidatos: `ODDI.`, `ZEN STUDIO`.

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
- **Base de datos:** Supabase (PostgreSQL), accedida vía Prisma ORM. Supabase se usa solo como motor de base de datos en la nube — el backend propio en Express es quien expone la API, no el cliente directo de Supabase ni PostgREST.
- **Frontend:** React + Vite, separado en `pages/` (público y admin), `components/`, `services/` (llamadas API), `hooks/`, `context/` (carrito, auth).
- **Deploy:** Backend en Render, Frontend en Vercel, DB ya en la nube en Supabase.
- **Variantes de producto:** cada prenda tiene variantes por talla + color, cada una con su propio stock — esto es lo que justifica la funcionalidad de "alertas de stock mínimo" del taller.

## Estado actual

- Estructura de carpetas definida (ver README.md), nada implementado todavía.
- Pendiente: `schema.prisma` (modelo Producto, Variante, Categoría, Orden, Usuario admin), luego backend capa por capa, luego frontend.

## Preferencias de trabajo para este proyecto

- Avanzar despacio, capa por capa, no generar todo de golpe.
- Código lo más simple y limpio posible — priorizar legibilidad sobre abstracciones innecesarias.
- No usar nombre/imagen real de la artista Jennie como marca del proyecto desplegado; usar nombres/estética inspirados, no literales.
