import { useEffect, useRef, useState } from "react";

const PARALLAX = 0.12;

// La foto se funde con el color de la página por la izquierda y por abajo (como en la home): no
// hay borde, y la máscara sirve para cualquier color de colección.
const FADE =
  "linear-gradient(to right, transparent 2%, #000 48%), linear-gradient(to bottom, #000 62%, transparent 98%)";

// Cabecera de una colección, con la misma estética que el hero de la home: etiqueta en monoespaciada,
// título enorme en condensada y la foto grande, fundida con el color de la página, que se revela de
// arriba hacia abajo y se desplaza más despacio que la página. Los colores salen de la paleta de la colección
// (el texto hereda `color` de la página). En móvil la foto va de fondo, atenuada.
function CollectionBanner({ collection, count }) {
  const photoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const image = collection.bannerImage ?? collection.image;
  const { accent } = collection.theme;

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Parallax suave de la foto con el scroll; no se activa si el sistema pide menos movimiento.
  useEffect(() => {
    const photo = photoRef.current;
    if (!photo || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    let frame = 0;
    function update() {
      frame = 0;
      photo.style.transform = `translateY(${(window.scrollY * PARALLAX).toFixed(1)}px)`;
    }
    function handleScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="relative min-h-[78vh] overflow-hidden"
      style={{ borderBottom: `1px solid ${accent}33` }}
    >
      {image && (
        <div
          aria-hidden="true"
          className={`collection-photo pointer-events-none absolute inset-y-0 right-0 w-full opacity-40 md:w-[72%] md:opacity-100 ${ready ? "is-revealing" : ""}`}
          style={{
            WebkitMaskImage: FADE,
            WebkitMaskComposite: "source-in",
            maskImage: FADE,
            maskComposite: "intersect",
          }}
        >
          <div ref={photoRef} className="h-[115%] w-full will-change-transform">
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
              style={{
                objectPosition:
                  collection.bannerPosition ??
                  collection.imagePosition ??
                  "50% 30%",
              }}
            />
          </div>
        </div>
      )}

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 sm:px-10">
        <div className="max-w-3xl">
          <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.3em] opacity-70">
            {collection.tagline} · Ruby. 2026
          </p>
          <h1 className="animate-fade-up mt-4 font-condensed text-[clamp(3.5rem,8vw,8rem)] font-light uppercase leading-[0.9] tracking-[-0.02em] [animation-delay:80ms]">
            {collection.title}
          </h1>
          <p className="animate-fade-up mt-6 max-w-md font-display text-sm opacity-80 [animation-delay:160ms] sm:text-base">
            {collection.description}
          </p>
          <div className="animate-fade-up mt-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] [animation-delay:240ms]">
            <span className="h-px w-16" style={{ backgroundColor: accent }} />
            {collection.phrase}
            {count != null && (
              <span className="opacity-60">· {count} piezas</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionBanner;
