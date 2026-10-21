import { useEffect } from "react";
import { createPortal } from "react-dom";

// Visor de fotos a pantalla completa: flechas, teclado (← → Esc) y clic fuera para cerrar.
function ImageLightbox({ images, index, onIndexChange, onClose, alt }) {
  const count = images.length;

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

  const arrowClass =
    "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/90 text-2xl text-black transition hover:bg-white";

  return createPortal(
    <div
      role="dialog"
      aria-label="Fotos del producto"
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <img
        key={index}
        src={images[index]?.url}
        alt={alt}
        className="max-h-[92vh] max-w-[92vw] animate-fade-in object-contain"
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-white/90 text-2xl leading-none text-black transition hover:bg-white"
      >
        ×
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange((index - 1 + count) % count);
            }}
            aria-label="Foto anterior"
            className={`${arrowClass} left-4`}
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
            className={`${arrowClass} right-4`}
          >
            ›
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-xs uppercase tracking-widest text-white/70">
            {index + 1} / {count}
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}

export default ImageLightbox;
