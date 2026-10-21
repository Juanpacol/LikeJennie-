import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

const BRAND_COLOR = "#D6001C";

// Color de la marca para la ruta actual: el de la colección en /colecciones/:slug y el rojo ruby
// en el resto.
function colorForPath(pathname) {
  const match = pathname.match(/^\/colecciones\/([^/]+)/);
  return (match && COLLECTIONS[match[1]]?.theme.page) || BRAND_COLOR;
}

// Marco de color alrededor de la ventana (solo escritorio) y color de la barra del navegador
// (<meta name="theme-color">). No se muestra en el panel de administración.
function BrandFrame() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const color = isAdmin ? BRAND_COLOR : colorForPath(pathname);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, [color]);

  if (isAdmin) return null;
  return <div aria-hidden="true" className="brand-frame" style={{ "--frame-color": color }} />;
}

export default BrandFrame;
