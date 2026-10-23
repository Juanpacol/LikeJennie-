import { useEffect } from "react";

// Pinta el header (y el hueco bajo él) con el color de la página mientras se ve: publica `--stage-color`
// (fondo) y `--header-ink` (texto) en <html> y los limpia al salir. Con `bg` vacío no hace nada.
export function useHeaderTheme(bg, ink = "#fff") {
  useEffect(() => {
    if (!bg) return undefined;
    const root = document.documentElement;
    root.style.setProperty("--stage-color", bg);
    root.style.setProperty("--header-ink", ink);
    return () => {
      root.style.removeProperty("--stage-color");
      root.style.removeProperty("--header-ink");
    };
  }, [bg, ink]);
}
