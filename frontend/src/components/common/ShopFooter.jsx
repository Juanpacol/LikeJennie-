import { Link } from "react-router-dom";
import shopPhoto from "../../assets/footer-shop.jpg";
import { COLLECTIONS } from "../../data/collections";
import { SOCIAL_ICONS } from "../../data/socialLinks";
import { useAccountPanel } from "../../context/AccountPanelContext";
import { useCart } from "../../context/CartContext";

const YEAR = new Date().getFullYear();

// Paleta de grises cálidos sacada de la propia foto (sepia): sombra, tono medio y luz.
const INK = "#D6CCB8";
const MUTED = "#837C71";

const LINK_CLASS =
  "hover-underline inline-block text-left font-mono text-xs uppercase tracking-[0.2em] opacity-80 transition hover:opacity-100";

function FooterColumn({ label, title, children }) {
  return (
    <div>
      <p
        className="font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{ color: MUTED }}
      >
        {label}
      </p>
      <h2 className="mt-3 font-condensed text-4xl font-light uppercase">
        {title}
      </h2>
      <ul className="mt-6 space-y-3">{children}</ul>
    </div>
  );
}

// Footer de la tienda (catálogo y productos): misma estructura y efecto de revelado que el de la
// home, pero en grises cálidos y con la foto sepia de la silueta. Lo envuelve FooterReveal.
function ShopFooter() {
  const { open: openCart } = useCart();
  const { open: openAccount } = useAccountPanel();
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#12110F",
        color: INK,
        // Efecto de footer revelado: --footer-progress lo define FooterReveal (1 si no aplica).
        filter: "blur(calc(10px * (1 - var(--footer-progress, 1))))",
        opacity: "var(--footer-progress, 1)",
      }}
    >
      {/* Foto vertical a la derecha, de alto completo; se funde con el fondo por la izquierda y abajo. */}
      <div
        className="pointer-events-none absolute inset-y-0 -right-[4%] hidden aspect-[1210/1554] md:block"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 5%, #000 60%), linear-gradient(to bottom, transparent, #000 18%, #000 70%, transparent)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(to right, transparent 5%, #000 60%), linear-gradient(to bottom, transparent, #000 18%, #000 70%, transparent)",
          maskComposite: "intersect",
        }}
      >
        <img
          src={shopPhoto}
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
      </div>
      {/* Marca gigante translúcida. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[8%] select-none text-center font-condensed text-[26vw] font-semibold uppercase leading-none tracking-[0.06em] opacity-[0.07]"
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
            <p className="font-condensed text-6xl font-semibold uppercase leading-none tracking-[0.06em]">
              Ruby<span className="text-accent">.</span>
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em]">
              Nos vemos en el próximo acto
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

export default ShopFooter;
