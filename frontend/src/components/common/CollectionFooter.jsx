import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";
import { SOCIAL_ICONS } from "../../data/socialLinks";

const YEAR = new Date().getFullYear();

const LINK_CLASS =
  "hover-underline inline-block font-mono text-xs uppercase tracking-[0.2em] opacity-80 transition hover:opacity-100";

// Footer revelado de una colección: más bajo que el de la home y centrado en ella. Lleva el nombre de
// la colección como marca de agua y título, su frase, un acceso a las otras dos colecciones y al
// catálogo, y las redes. Usa la paleta y la foto de `collection.footer`. Lo envuelve FooterReveal.
function CollectionFooter({ slug, collection }) {
  const { bg, ink, muted, image, position, tagline } = collection.footer;
  const others = Object.entries(COLLECTIONS).filter(([key]) => key !== slug);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: bg,
        color: ink,
        // Efecto de footer revelado: --footer-progress lo define FooterReveal (1 si no aplica).
        filter: "blur(calc(10px * (1 - var(--footer-progress, 1))))",
        opacity: "var(--footer-progress, 1)",
      }}
    >
      {/* Foto a la derecha, fundida con el fondo por la izquierda y por arriba y abajo. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] md:block"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 2%, #000 60%), linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(to right, transparent 2%, #000 60%), linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)",
          maskComposite: "intersect",
        }}
      >
        <img
          src={image ?? collection.image}
          alt=""
          className="h-full w-full object-cover opacity-90"
          style={{ objectPosition: position ?? "50% 30%" }}
        />
      </div>

      {/* Nombre de la colección como marca de agua. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[6%] left-[4%] select-none whitespace-nowrap font-condensed text-[13vw] font-semibold uppercase leading-none tracking-[0.02em] opacity-[0.08]"
      >
        {collection.title}
      </p>

      <div
        className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 sm:px-10 md:pr-[36%] md:pt-24"
        style={{
          transform: "translateY(calc((1 - var(--footer-progress, 1)) * 30%))",
        }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: muted }}
        >
          {collection.tagline} · Ruby. {YEAR}
        </p>
        <h2 className="mt-3 font-condensed text-5xl font-light uppercase leading-[0.95] sm:text-6xl">
          {tagline}
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: muted }}
            >
              Otras colecciones
            </p>
            <ul className="mt-3 space-y-2.5">
              {others.map(([key, other]) => (
                <li key={key}>
                  <Link to={`/colecciones/${key}`} className={LINK_CLASS}>
                    {other.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalogo" className={LINK_CLASS}>
                  Ver todo el catálogo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: muted }}
            >
              Redes
            </p>
            <ul className="mt-3 space-y-2.5">
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
            </ul>
          </div>
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
          © {YEAR} Ruby. Proyecto académico.
        </p>
      </div>
    </footer>
  );
}

export default CollectionFooter;
