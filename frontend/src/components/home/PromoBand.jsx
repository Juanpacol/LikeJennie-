import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

const THEMES = {
  lilac: { band: "bg-lilac text-lilac-deep", button: "bg-lilac-deep text-white hover:bg-black" },
  ruby: { band: "bg-accent text-white", button: "bg-black text-white hover:bg-white hover:text-black" },
};

// Una banda promocional por colección, bajo el hero.
function PromoBand() {
  return Object.entries(COLLECTIONS).map(([slug, collection]) => {
    const theme = THEMES[collection.theme];

    return (
      <section key={slug} className={`px-6 py-16 text-center ${theme.band}`}>
        <p className="font-display text-xs uppercase tracking-widest">{collection.tagline}</p>
        <h2 className="mt-3 font-script text-6xl leading-none sm:text-7xl">{collection.title}</h2>
        <p className="mx-auto mt-4 max-w-md font-display text-sm">{collection.description}</p>
        <Link
          to={`/colecciones/${slug}`}
          className={`mt-8 inline-block px-8 py-3 font-display text-xs uppercase tracking-widest transition ${theme.button}`}
        >
          Comprar ahora
        </Link>
      </section>
    );
  });
}

export default PromoBand;
