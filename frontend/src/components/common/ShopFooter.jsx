import { Link } from "react-router-dom";
import shopPhoto from "../../assets/footer-shop.jpg";
import shopPhotoB from "../../assets/footer-shop-b.jpg";
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
      <h2 className="mt-2 font-condensed text-3xl font-light uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
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
      {/* Dos fotos, una a cada lado: la silueta a la izquierda y la bailarina a la derecha. Se funden
          con el fondo por el lado interior y por arriba y abajo. */}
      {[
        {
          src: shopPhoto,
          side: "left-0",
          fade: "to left",
          position: "50% 20%",
        },
        {
          src: shopPhotoB,
          side: "right-0",
          fade: "to right",
          position: "50% 100%",
          zoom: "origin-bottom scale-[1.9]",
        },
      ].map((photo) => (
        <div
          key={photo.src}
          className={`pointer-events-none absolute inset-y-0 ${photo.side} hidden w-[24%] md:block`}
          style={{
            WebkitMaskImage: `linear-gradient(${photo.fade}, transparent 2%, #000 65%), linear-gradient(to bottom, transparent, #000 22%, #000 75%, transparent)`,
            WebkitMaskComposite: "source-in",
            maskImage: `linear-gradient(${photo.fade}, transparent 2%, #000 65%), linear-gradient(to bottom, transparent, #000 22%, #000 75%, transparent)`,
            maskComposite: "intersect",
          }}
        >
          <img
            src={photo.src}
            alt=""
            className={`h-full w-full object-cover opacity-90 ${photo.zoom ?? ""}`}
            style={{ objectPosition: photo.position }}
          />
        </div>
      ))}
      {/* Marca gigante translúcida. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[4%] select-none text-center font-condensed text-[20vw] font-semibold uppercase leading-none tracking-[0.06em] opacity-[0.07]"
      >
        Ruby.
      </p>

      <div
        className="relative mx-auto max-w-7xl px-6 pb-8 pt-40 md:px-[23%] md:pt-44"
        style={{
          transform: "translateY(calc((1 - var(--footer-progress, 1)) * 30%))",
        }}
      >
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3 lg:text-center">
            <p className="font-condensed text-5xl font-semibold uppercase leading-none tracking-[0.06em]">
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

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 md:text-center">
          © {YEAR} Ruby. Proyecto académico.
        </p>
      </div>
    </footer>
  );
}

export default ShopFooter;
