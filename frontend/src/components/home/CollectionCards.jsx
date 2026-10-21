import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

// Sección "Colecciones": una tarjeta con foto por colección (tres lado a lado en escritorio; en móvil
// se deslizan de lado, una por pantalla). Toma la foto de la cabecera de la colección (`bannerImage`)
// o la de su banda (`image`). Al pasar el mouse, la foto hace zoom y sube su frase y el botón.
function CollectionCards() {
  return (
    <section className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-xs uppercase tracking-widest text-white/60">
          Campañas
        </p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl">Colecciones</h2>

        <ul className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {Object.entries(COLLECTIONS).map(([slug, collection]) => {
            const { page, accent } = collection.theme;
            const image = collection.bannerImage ?? collection.image;

            return (
              <li key={slug} className="w-[78%] shrink-0 snap-center md:w-auto">
                <Link
                  to={`/colecciones/${slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden"
                  style={{ backgroundColor: page }}
                >
                  {image && (
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        objectPosition:
                          collection.bannerPosition ??
                          collection.imagePosition ??
                          "50% 30%",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                  <div className="absolute inset-x-5 bottom-5">
                    <p className="font-display text-[11px] uppercase tracking-widest text-white/70">
                      {collection.tagline}
                    </p>
                    <h3 className="mt-1 font-script text-5xl leading-none">
                      {collection.title}
                    </h3>

                    {/* La frase y el botón suben al pasar el mouse; en pantallas táctiles se ven siempre. */}
                    <div className="grid transition-all duration-500 ease-out [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 group-hover:[@media(hover:hover)]:grid-rows-[1fr] group-hover:[@media(hover:hover)]:opacity-100">
                      <div className="overflow-hidden">
                        {collection.phrase && (
                          <p className="mt-3 font-display text-xs uppercase tracking-[0.25em] text-white/80">
                            {collection.phrase}
                          </p>
                        )}
                        <span
                          className="mt-4 inline-block px-6 py-2.5 font-display text-xs uppercase tracking-widest"
                          style={{
                            backgroundColor:
                              accent === "#24102F" ? "#FFFFFF" : accent,
                            color: accent === "#24102F" ? "#24102F" : "#FFFFFF",
                          }}
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
      </div>
    </section>
  );
}

export default CollectionCards;
