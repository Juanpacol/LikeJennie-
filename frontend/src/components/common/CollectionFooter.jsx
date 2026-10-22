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
  const { bg, ink, muted, image, images, position, tagline } =
    collection.footer;
  // Una foto (a la derecha) o dos (una a cada lado, y el contenido queda en el centro).
  const photos = images ?? [{ src: image ?? collection.image, position }];
  const two = photos.length > 1;
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
      {/* Fotos fundidas con el fondo por el lado interior y por arriba y abajo. */}
      {photos.map((photo, index) => {
        const left = two && index === 0;
        const fade = `linear-gradient(${left ? "to left" : "to right"}, transparent 2%, #000 60%), linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)`;
        return (
          <div
            key={photo.src}
            className={`pointer-events-none absolute inset-y-0 hidden md:block ${left ? "left-0" : "right-0"} ${two ? "w-[26%]" : "w-[34%]"}`}
            style={{
              WebkitMaskImage: fade,
              WebkitMaskComposite: "source-in",
              maskImage: fade,
              maskComposite: "intersect",
            }}
          >
            <img
              src={photo.src}
              alt=""
              className="h-full w-full object-cover opacity-90"
              style={{ objectPosition: photo.position ?? "50% 30%" }}
            />
          </div>
        );
      })}

      {/* Nombre de la colección como marca de agua. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[6%] left-[4%] select-none whitespace-nowrap font-condensed text-[13vw] font-semibold uppercase leading-none tracking-[0.02em] opacity-[0.08]"
      >
        {collection.title}
      </p>

      <div
        className={`relative mx-auto max-w-7xl px-6 pb-8 pt-20 sm:px-10 ${two ? "md:px-[28%]" : "md:pr-[36%]"} md:pt-24`}
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
