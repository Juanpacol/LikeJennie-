import { useEffect } from "react";
import { createPortal } from "react-dom";

// El dibujo de fondo se desvanece por los bordes para no marcar su rectángulo.
const ART_FADE =
  "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent), linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)";

const buttonClass =
  "flex h-11 w-11 items-center justify-center border border-white/40 bg-black/50 text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-black";

// Visor de fotos a pantalla completa: flechas, miniaturas, teclado (← → Esc) y clic fuera para cerrar.
// Toma los colores de la colección del producto (`collection.panel`): fondo del color de la colección,
// su dibujo muy tenue, el nombre como marca de agua y un foco de luz detrás de la prenda para que las
// prendas negras no se pierdan.
function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  alt,
  collection,
}) {
  const count = images.length;
  const { panel, art, title } = collection;

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    }
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, count, onClose, onIndexChange]);

  const arrowClass = `absolute top-1/2 -translate-y-1/2 ${buttonClass}`;

  return createPortal(
    <div
      role="dialog"
      aria-label="Fotos del producto"
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center overflow-hidden pb-20 text-white"
      style={{ backgroundColor: panel.stage }}
      onClick={onClose}
    >
      {/* Foco de luz con el color de la colección, detrás de la prenda. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 60% at 50% 46%, color-mix(in srgb, ${panel.bg} 55%, transparent), transparent 70%)`,
        }}
      />
      <img
        src={art.image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-0 hidden h-[105%] w-auto max-w-none opacity-20 mix-blend-screen md:block"
        style={{
          WebkitMaskImage: ART_FADE,
          WebkitMaskComposite: "source-in",
          maskImage: ART_FADE,
          maskComposite: "intersect",
        }}
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 right-4 select-none whitespace-nowrap font-condensed text-[min(26vw,20rem)] font-semibold uppercase leading-none opacity-[0.06]"
      >
        {title}
      </p>

      <img
        key={index}
        src={images[index]?.url}
        alt={alt}
        className="relative max-h-[74vh] max-w-[88vw] animate-fade-in object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className={`absolute right-5 top-5 text-2xl leading-none ${buttonClass}`}
      >
        ×
      </button>

      <p className="absolute left-5 top-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange((index - 1 + count) % count);
            }}
            aria-label="Foto anterior"
            className={`${arrowClass} left-5`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange((index + 1) % count);
            }}
            aria-label="Foto siguiente"
            className={`${arrowClass} right-5`}
          >
            ›
          </button>

          <div
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            {images.map((image, i) => (
              <button
                key={image.id ?? image.url}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === index}
                className={`h-16 w-14 overflow-hidden border bg-black/40 p-1 transition ${
                  i === index
                    ? "border-white"
                    : "border-white/25 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}

export default ImageLightbox;
