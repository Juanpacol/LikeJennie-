import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";
import SocialDock from "./SocialDock";

const YEAR = new Date().getFullYear();

// Footer delgado para las páginas interiores (catálogo, colecciones, producto, admin): una sola
// franja con la marca, los enlaces principales y las redes. El footer grande, con el efecto de
// revelado, es solo de la landing. `dark` elige el tema, igual que el SiteHeader.
function SlimFooter({ dark = true }) {
  const theme = dark
    ? "border-white/10 bg-[var(--stage-color,#000)] text-white"
    : "border-gray-200 bg-white text-black";
  const linkClass =
    "hover-underline font-display text-xs uppercase tracking-widest opacity-70 transition hover:opacity-100";

  return (
    <footer className={`relative z-10 border-t ${theme}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <Link
            to="/"
            className="font-condensed font-semibold uppercase tracking-[0.06em] text-3xl leading-none"
          >
            Ruby.
          </Link>
          <p className="mt-1 font-display text-[11px] uppercase tracking-widest opacity-50">
            © {YEAR} Ruby. Proyecto académico.
          </p>
        </div>

        <nav
          aria-label="Pie de página"
          className="flex flex-wrap justify-center gap-x-6 gap-y-3"
        >
          <Link to="/catalogo" className={linkClass}>
            Tienda
          </Link>
          {Object.entries(COLLECTIONS).map(([slug, collection]) => (
            <Link key={slug} to={`/colecciones/${slug}`} className={linkClass}>
              {collection.title}
            </Link>
          ))}
          <Link to="/admin/login" className={linkClass}>
            Acceso administrador
          </Link>
        </nav>

        <SocialDock />
      </div>
    </footer>
  );
}

export default SlimFooter;
