import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { brandThemeForPath } from "../../utils/brandTheme";

// Marco de color alrededor de la ventana (solo escritorio) y color de la barra del navegador
// (<meta name="theme-color">). No se muestra en el panel de administración.
function BrandFrame() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const color = brandThemeForPath(isAdmin ? "/" : pathname).color;

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, [color]);

  if (isAdmin) return null;
  return (
    <div
      aria-hidden="true"
      className="brand-frame"
      style={{ "--frame-color": color }}
    />
  );
}

export default BrandFrame;
