import { useEffect, useRef, useState } from "react";

const MIN_WIDTH = 768;

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}

// "Footer revelado": el footer queda fijo al fondo, detrás del contenido, y se va descubriendo
// cuando el contenido sube al llegar al final de la página (efecto visto en Hermes). Mientras
// se descubre expone --footer-progress (0 a 1) para que el footer se desenfoque, se aclare y suba.
// Solo en escritorio y si el footer cabe en la ventana; si no (o con `disabled`), es un footer normal.
function FooterReveal({ children, disabled = false }) {
  const wrapperRef = useRef(null);
  const footerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    function measure() {
      const footerHeight = footer.offsetHeight;
      setHeight(footerHeight);
      setEnabled(
        !disabled &&
          window.innerWidth >= MIN_WIDTH &&
          footerHeight <= window.innerHeight,
      );
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [disabled]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!enabled) {
      wrapper.style.removeProperty("--footer-progress");
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;

    function update() {
      frame = 0;
      // La parte del footer ya descubierta: lo que sobra del final de la ventana bajo el contenido.
      const top = wrapper.getBoundingClientRect().top + window.scrollY;
      const revealed = window.scrollY + window.innerHeight - top;
      const progress = reduceMotion ? 1 : clamp(revealed / height);
      wrapper.style.setProperty("--footer-progress", progress.toFixed(3));
    }

    function handleScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled, height]);

  return (
    <div ref={wrapperRef} style={enabled ? { height } : undefined}>
      <div
        ref={footerRef}
        className={enabled ? "fixed inset-x-0 bottom-0 z-0" : ""}
      >
        {children}
      </div>
    </div>
  );
}

export default FooterReveal;
