import { COLLECTIONS } from "../data/collections";

const DEFAULT_THEME = { color: "#D6001C", ink: "#FFFFFF" };

// Colores de la marca para una ruta: el rojo ruby por defecto y, en /colecciones/:slug, los de
// la colección (fondo y texto). Los usan el marco, el color de la barra y el footer.
export function brandThemeForPath(pathname) {
  const match = pathname.match(/^\/colecciones\/([^/]+)/);
  const theme = match && COLLECTIONS[match[1]]?.theme;
  return theme ? { color: theme.page, ink: theme.ink } : DEFAULT_THEME;
}
