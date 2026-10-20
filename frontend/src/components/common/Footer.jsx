import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SOCIAL_ICONS } from "../../data/socialLinks";
import { getCategories } from "../../services/category.service";

// Footer del sitio. `dark` elige el tema, igual que el SiteHeader.
function Footer({ dark = true }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const theme = dark ? "border-white/10 bg-black text-white" : "border-gray-200 bg-white text-black";
  const muted = dark ? "text-white/60" : "text-gray-500";
  const headingClass = "font-display text-xs uppercase tracking-widest";
  const linkClass = `font-display text-sm ${muted} transition hover:text-accent`;

  return (
    <footer id="contacto" className={`border-t ${theme}`}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-script text-5xl leading-none">Ruby.</p>
          <p className={`mt-3 font-display text-sm ${muted}`}>Streetwear con flow propio.</p>
        </div>

        <nav aria-label="Tienda">
          <h2 className={headingClass}>Tienda</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/catalogo" className={linkClass}>
                Todo el catálogo
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/catalogo?categoria=${category.slug}`} className={linkClass}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Sígueme</h2>
          <ul className="mt-4 space-y-2">
            {SOCIAL_ICONS.map((icon) => (
              <li key={icon.platform}>
                <a
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 ${linkClass}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d={icon.d} />
                  </svg>
                  {icon.platform}
                </a>
              </li>
            ))}
          </ul>
          <Link to="/admin/login" className={`mt-6 inline-block text-xs underline ${muted}`}>
            Acceso administrador
          </Link>
        </div>
      </div>

      <div
        className={`border-t py-4 text-center text-xs ${
          dark ? "border-white/10 text-white/40" : "border-gray-100 text-gray-400"
        }`}
      >
        © {new Date().getFullYear()} Ruby. Proyecto académico.
      </div>
    </footer>
  );
}

export default Footer;
