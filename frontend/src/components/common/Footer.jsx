import { Link, useLocation } from "react-router-dom";
import stagePhoto from "../../assets/footer-stage.jpg";
import { COLLECTIONS } from "../../data/collections";
import { SOCIAL_ICONS } from "../../data/socialLinks";
import { useAccountPanel } from "../../context/AccountPanelContext";
import { useCart } from "../../context/CartContext";
import { brandThemeForPath } from "../../utils/brandTheme";

const YEAR = new Date().getFullYear();

const LINK_CLASS =
  "hover-underline inline-block text-left font-mono text-xs uppercase tracking-[0.2em] opacity-80 transition hover:opacity-100";

// Una columna del footer: etiqueta pequeña, título grande y lista de enlaces.
function FooterColumn({ label, title, children }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-60">
        {label}
      </p>
      <h2 className="mt-3 font-condensed text-4xl font-light uppercase">
        {title}
      </h2>
      <ul className="mt-6 space-y-3">{children}</ul>
    </div>
  );
}

// Footer a color de la marca: foto en duotono de fondo, la marca gigante como marca de agua y
// tres columnas de enlaces (el menú del header ya lista las categorías). El color sigue el de la ruta (rojo ruby o el de la colección).
function Footer() {
  const { pathname } = useLocation();
  const { color, ink } = brandThemeForPath(pathname);
  const { open: openCart } = useCart();
  const { open: openAccount } = useAccountPanel();
  return (
    <footer
      id="contacto"
      className="relative overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: color,
        color: ink,
        // Efecto de footer revelado: --footer-progress lo define FooterReveal (1 si no aplica).
        filter: "blur(calc(10px * (1 - var(--footer-progress, 1))))",
        opacity: "var(--footer-progress, 1)",
      }}
    >
      {/* Foto vertical en blanco y negro mezclada con el color de la marca (duotono). Se muestra
          entera, de alto completo, y se desvanece por abajo y por los lados. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden aspect-[736/1308] md:block"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 40%, transparent 78%), linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(to bottom, #000 40%, transparent 78%), linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)",
          maskComposite: "intersect",
        }}
      >
        <img
          src={stagePhoto}
          alt=""
          className="h-full w-full object-cover opacity-60 mix-blend-screen grayscale"
        />
      </div>
      {/* Marca gigante translúcida. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[8%] select-none text-center font-condensed font-semibold uppercase tracking-[0.06em] text-[26vw] leading-none opacity-[0.12]"
      >
        Ruby.
      </p>

      <div
        className="relative mx-auto max-w-6xl px-6 pb-8 pt-72 md:pt-96"
        style={{
          transform: "translateY(calc((1 - var(--footer-progress, 1)) * 30%))",
        }}
      >
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-condensed font-semibold uppercase tracking-[0.06em] text-6xl leading-none">
              Ruby.
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em]">
              Wanna rock with this?
            </p>
          </div>

          <FooterColumn label="Campañas" title="Colecciones">
            {Object.entries(COLLECTIONS).map(([slug, collection]) => (
              <li key={slug}>
                <Link to={`/colecciones/${slug}`} className={LINK_CLASS}>
                  {collection.title}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn label="Tu compra" title="Cuenta">
            <li>
              <Link to="/catalogo" className={LINK_CLASS}>
                Catálogo
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openAccount}
                className={LINK_CLASS}
              >
                Mi cuenta
              </button>
            </li>
            <li>
              <button type="button" onClick={openCart} className={LINK_CLASS}>
                Carrito
              </button>
            </li>
            <li>
              <Link to="/admin/login" className={LINK_CLASS}>
                Acceso administrador
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn label="Redes" title="Sígueme">
            {SOCIAL_ICONS.map((icon) => (
              <li key={icon.platform}>
                <a
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${LINK_CLASS} flex items-center gap-3`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d={icon.d} />
                  </svg>
                  {icon.platform}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
          © {YEAR} Ruby. Proyecto académico.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
