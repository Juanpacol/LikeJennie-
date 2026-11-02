-- Activa Row Level Security en todas las tablas del esquema public.
--
-- Supabase expone el esquema public por PostgREST con la anon key. Sin RLS, quien tenga esa clave
-- puede leer y escribir estas tablas (incluidos los hashes de admin_users). Con RLS activado y sin
-- políticas, los roles anon y authenticated no ven ni modifican nada.
--
-- El backend no se ve afectado: Prisma se conecta como `postgres`, que tiene BYPASSRLS. No se usa
-- FORCE ROW LEVEL SECURITY a propósito (aplicaría también al dueño de las tablas).
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_users"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_variants"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products"           ENABLE ROW LEVEL SECURITY;
