import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Intensidad del deslizamiento: cuanto menor, más inercia (Hermes usa 0.09).
const LERP = 0.09;

// Scroll suave con inercia (Lenis). No se activa si el sistema pide reducir el movimiento.
// Las zonas con scroll propio (p. ej. la lista del carrito) llevan `data-lenis-prevent`.
// También devuelve la página arriba al cambiar de ruta, para que cada página empiece desde el inicio.
function SmoothScroll() {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const lenis = new Lenis({ lerp: LERP, autoRaf: true });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default SmoothScroll;
