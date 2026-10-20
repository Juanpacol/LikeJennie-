import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

// Una banda promocional por colección, bajo el hero, con los colores de su tema.
function PromoBand() {
  return Object.entries(COLLECTIONS).map(([slug, collection]) => {
    const { page, ink, accent, onAccent } = collection.theme;

    return (
      <section
        key={slug}
        className="px-6 py-16 text-center"
        style={{ backgroundColor: page, color: ink }}
      >
        <p className="font-display text-xs uppercase tracking-widest">{collection.tagline}</p>
        <h2 className="mt-3 font-script text-6xl leading-none sm:text-7xl">{collection.title}</h2>
        <p className="mx-auto mt-4 max-w-md font-display text-sm">{collection.description}</p>
        <Link
          to={`/colecciones/${slug}`}
          className="mt-8 inline-block px-8 py-3 font-display text-xs uppercase tracking-widest transition hover:opacity-80"
          style={{ backgroundColor: accent, color: onAccent }}
        >
          Comprar ahora
        </Link>
      </section>
    );
  });
}

export default PromoBand;
