import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

// Sección "Colecciones": una tarjeta con foto por colección (tres lado a lado en escritorio; en móvil
// se deslizan de lado, una por pantalla). Toma la foto de la cabecera de la colección (`bannerImage`)
// o la de su banda (`image`), fundida con el color de la colección. Al pasar el mouse, la foto hace
// zoom y sube su frase y el botón.
function CollectionCards() {
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const slugs = Object.keys(COLLECTIONS);

  // Móvil: la tarjeta activa es la más cercana al borde izquierdo de la lista (alimenta los puntos).
  function handleScroll(event) {
    const list = event.currentTarget;
    const card = list.firstElementChild;
    if (!card) return;
    setActive(
      Math.min(
        slugs.length - 1,
        Math.round(list.scrollLeft / (card.offsetWidth + 16)),
      ),
    );
  }

  // Puntos de la lista en móvil: llevan a la tarjeta correspondiente.
  function goTo(index) {
    const list = listRef.current;
    const card = list?.children[index];
    if (!card) return;
    const offset =
      card.getBoundingClientRect().left - list.getBoundingClientRect().left;
    list.scrollTo({ left: list.scrollLeft + offset - 24, behavior: "smooth" });
  }

  return (
    <section className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
          Campañas
        </p>
        <h2 className="mt-3 font-condensed text-6xl font-light uppercase tracking-[-0.01em] sm:text-7xl">
          Colecciones
        </h2>

        <ul
          ref={listRef}
          onScroll={handleScroll}
          className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0"
        >
          {Object.entries(COLLECTIONS).map(([slug, collection]) => {
            const { page, ink, accent, onAccent } = collection.theme;
            const image = collection.bannerImage ?? collection.image;

            return (
              <li key={slug} className="w-[78%] shrink-0 snap-center md:w-auto">
                <Link
                  to={`/colecciones/${slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden"
                  style={{
                    backgroundColor: page,
                    color: ink,
                    // Colecciones oscuras: una línea fina del acento las separa del fondo negro.
                    border: collection.divider
                      ? `1px solid ${accent}99`
                      : undefined,
                  }}
                >
                  {/* La foto se funde hacia abajo con el color de la colección, como en sus bandas. */}
                  {image && (
                    <div
                      className="absolute inset-x-0 top-0 h-[78%] [@media(hover:none)]:h-[58%]"
                      style={{
                        WebkitMaskImage:
                          "linear-gradient(to bottom, #000 60%, transparent)",
                        maskImage:
                          "linear-gradient(to bottom, #000 60%, transparent)",
                      }}
                    >
                      <img
                        src={image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                          objectPosition:
                            collection.bannerPosition ??
                            collection.imagePosition ??
                            "50% 30%",
                        }}
                      />
                    </div>
                  )}

                  <div className="absolute inset-x-5 bottom-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                      {collection.tagline}
                    </p>
                    <h3 className="mt-1 font-script text-4xl leading-none lg:text-[2.6rem]">
                      {collection.title}
                    </h3>

                    {/* La frase y el botón suben al pasar el mouse; en pantallas táctiles se ven siempre. */}
                    <div className="grid transition-all duration-500 ease-out [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 group-hover:[@media(hover:hover)]:grid-rows-[1fr] group-hover:[@media(hover:hover)]:opacity-100">
                      <div className="overflow-hidden">
                        {collection.phrase && (
                          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
                            {collection.phrase}
                          </p>
                        )}
                        <span
                          className="mt-4 inline-block px-6 py-2.5 font-display text-xs uppercase tracking-widest"
                          style={{ backgroundColor: accent, color: onAccent }}
                        >
                          Ver colección
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Móvil: puntos con la tarjeta activa y una pista para deslizar. */}
        <div className="mt-6 flex items-center justify-between md:hidden">
          <div className="flex gap-2">
            {slugs.map((slug, index) => (
              <button
                key={slug}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ver ${COLLECTIONS[slug].title}`}
                aria-current={index === active}
                className={`h-1.5 transition-all duration-300 ${
                  index === active ? "w-8 bg-accent" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            Desliza →
          </p>
        </div>
      </div>
    </section>
  );
}

export default CollectionCards;
