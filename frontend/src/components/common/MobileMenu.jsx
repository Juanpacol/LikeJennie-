import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";
import SocialDock from "./SocialDock";

const LINK_CLASS = "hover-underline inline-block font-display text-2xl";

// Menú de navegación para pantallas pequeñas: panel lila que entra desde la izquierda, con el
// estilo del carrito. Se cierra con la ×, tocando fuera, con Escape o al elegir un enlace.
// Va en un portal para no quedar atrapado dentro del header (que tiene backdrop-filter).
function MobileMenu({ categories, onClose }) {
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <aside
        role="dialog"
        aria-label="Menú"
        data-lenis-prevent
        className="relative flex h-full w-[85%] max-w-sm animate-slide-in-left flex-col overflow-y-auto rounded-r-3xl bg-lilac p-6 font-display text-lilac-deep shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="font-script text-4xl leading-none">Ruby.</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-lilac-deep/60 text-lg leading-none transition hover:bg-white/50"
          >
            ×
          </button>
        </div>

        <nav className="mt-10">
          <p className="text-xs uppercase tracking-widest opacity-60">Tienda</p>
          <ul className="mt-3 space-y-4">
            <li>
              <Link to="/catalogo" onClick={onClose} className={LINK_CLASS}>
                Todo el catálogo
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/catalogo?categoria=${category.slug}`}
                  onClick={onClose}
                  className={LINK_CLASS}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs uppercase tracking-widest opacity-60">
            Colecciones
          </p>
          <ul className="mt-3 space-y-4">
            {Object.entries(COLLECTIONS).map(([slug, collection]) => (
              <li key={slug}>
                <Link
                  to={`/colecciones/${slug}`}
                  onClick={onClose}
                  className={LINK_CLASS}
                >
                  {collection.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SocialDock className="mt-auto justify-start pt-10" />
      </aside>

      <div
        className="flex-1 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>,
    document.body,
  );
}

export default MobileMenu;
