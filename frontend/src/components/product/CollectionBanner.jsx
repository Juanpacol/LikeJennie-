import { useEffect, useRef } from "react";

const PARALLAX = 0.18;

// Cabecera de una colección: texto a la izquierda y la foto de la colección a la derecha, fundida con
// el fondo mediante una máscara (sirve para cualquier color de página). La foto entra con un zoom que
// se asienta y, al hacer scroll, se desplaza más despacio que la página (parallax); en móvil va de fondo.
function CollectionBanner({ collection }) {
  const photoRef = useRef(null);
  const image = collection.bannerImage ?? collection.image;
  const { accent } = collection.theme;

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
      className="relative overflow-hidden bg-black/10"
      style={
        collection.divider
          ? { borderBottom: `1px solid ${accent}66` }
          : undefined
      }
    >
      {image && (
        <div
          ref={photoRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[-15%] right-0 w-full opacity-40 will-change-transform md:aspect-square md:w-auto md:opacity-100"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 40%), linear-gradient(to bottom, transparent, #000 15%, #000 80%, transparent)",
            WebkitMaskComposite: "source-in",
            maskImage:
              "linear-gradient(to right, transparent, #000 40%), linear-gradient(to bottom, transparent, #000 15%, #000 80%, transparent)",
            maskComposite: "intersect",
          }}
        >
          <img
            src={image}
            alt=""
            className="h-full w-full animate-banner-in object-cover"
            style={{
              objectPosition:
                collection.bannerPosition ??
                collection.imagePosition ??
                "50% 30%",
            }}
          />
        </div>
      )}

      <div className="relative mx-auto flex min-h-[380px] max-w-6xl flex-col justify-center px-6 py-16 md:min-h-[460px]">
        <div className="animate-fade-up text-center md:max-w-xl md:text-left">
          <p className="font-display text-xs uppercase tracking-widest">
            Colección
          </p>
          <h1 className="mt-3 font-script text-6xl leading-none sm:text-7xl">
            {collection.title}
          </h1>
          <p className="mt-4 font-display text-sm">{collection.description}</p>
          {collection.phrase && (
            <p className="mt-6 flex items-center gap-4 font-display text-[11px] uppercase tracking-[0.3em] opacity-80">
              <span className="h-px flex-1 bg-current opacity-40" />
              {collection.phrase}
              <span className="h-px flex-1 bg-current opacity-40 md:hidden" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionBanner;
