import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";
import SocialDock from "./SocialDock";

const LINK_CLASS =
  "group flex items-baseline gap-4 font-condensed text-4xl font-light uppercase leading-none transition-colors hover:text-accent";

// Menú de navegación para pantallas pequeñas: panel negro con borde rojo que entra desde la izquierda, con los
// enlaces numerados en tipografía condensada. Se cierra con la ×, tocando fuera, con Escape o al elegir un enlace.
// Va en un portal para no quedar atrapado dentro del header (que tiene backdrop-filter).
function MobileMenu({ onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    // Evita que la página se desplace por detrás mientras el menú está abierto.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const links = [
    { to: "/catalogo", label: "Tienda", note: "Todo el catálogo" },
    ...Object.entries(COLLECTIONS).map(([slug, collection]) => ({
      to: `/colecciones/${slug}`,
      label: collection.title,
      note: collection.tagline,
    })),
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <aside
        role="dialog"
        aria-label="Menú"
        data-lenis-prevent
        className="relative flex h-full w-[88%] max-w-sm animate-slide-in-left flex-col overflow-y-auto border-r-2 border-accent bg-[#0b0b0b] p-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="font-condensed text-4xl font-semibold uppercase leading-none tracking-[0.06em]">
            Ruby.
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-10 w-10 items-center justify-center border border-white/30 text-lg leading-none transition hover:bg-white hover:text-black"
          >
            ×
          </button>
        </div>

        <nav className="mt-12">
          <ul className="space-y-7">
            {links.map((link, index) => (
              <li key={link.to}>
                <Link to={link.to} onClick={onClose} className={LINK_CLASS}>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    {link.label}
                    <span className="font-mono text-[10px] tracking-[0.25em] text-white/50">
                      {link.note}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SocialDock className="mt-auto justify-start pt-10" />
      </aside>

      <div
        className="flex-1 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>,
    document.body,
  );
}

export default MobileMenu;
