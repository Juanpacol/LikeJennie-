import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

// Banda con foto (colección con `image`): en móvil la foto va de fondo con capa oscura y texto
// blanco; desde md el texto queda a la izquierda sobre el color de la colección y la foto a la
// derecha, fundida con un degradado, para que no se recorte ni se vea borrosa.
function ImageBand({ slug, collection }) {
  const { page, ink, accent, onAccent } = collection.theme;
  const colors = { "--ink": ink, "--accent": accent, "--on-accent": onAccent };

  return (
    <section
      className="relative overflow-hidden bg-black px-6 py-20 text-center text-white md:bg-[color:var(--page)] md:min-h-[440px] md:py-24 md:text-left md:text-[color:var(--ink)]"
      style={{ ...colors, "--page": page }}
    >
      {/* Móvil: la foto de fondo, oscurecida. */}
      <img
        src={collection.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_25%] md:hidden"
      />
      <div className="absolute inset-0 bg-black/50 md:hidden" />

      {/* Desde md: la foto entera (cuadrada) a la derecha, fundida con el color de la banda. */}
      <div className="absolute inset-y-0 right-0 hidden aspect-square md:block">
        <img
          src={collection.image}
          alt=""
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${page} 0%, transparent 35%)`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl md:px-6">
        <div className="md:max-w-sm">
          <p className="font-display text-xs uppercase tracking-widest">
            {collection.tagline}
          </p>
          <h2 className="mt-3 font-script text-6xl leading-none sm:text-7xl">
            {collection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-display text-sm md:mx-0">
            {collection.description}
          </p>
          <Link
            to={`/colecciones/${slug}`}
            className="mt-8 inline-block bg-white px-8 py-3 font-display text-xs uppercase tracking-widest text-[color:var(--ink)] transition hover:opacity-80 md:bg-[color:var(--accent)] md:text-[color:var(--on-accent)]"
          >
            Comprar ahora
          </Link>
        </div>
      </div>
    </section>
  );
}

function ColorBand({ slug, collection }) {
  const { page, ink, accent, onAccent } = collection.theme;

  return (
    <section
      className="px-6 py-16 text-center"
      style={{ backgroundColor: page, color: ink }}
    >
      <p className="font-display text-xs uppercase tracking-widest">
        {collection.tagline}
      </p>
      <h2 className="mt-3 font-script text-6xl leading-none sm:text-7xl">
        {collection.title}
      </h2>
      <p className="mx-auto mt-4 max-w-md font-display text-sm">
        {collection.description}
      </p>
      <Link
        to={`/colecciones/${slug}`}
        className="mt-8 inline-block px-8 py-3 font-display text-xs uppercase tracking-widest transition hover:opacity-80"
        style={{ backgroundColor: accent, color: onAccent }}
      >
        Comprar ahora
      </Link>
    </section>
  );
}

// Una banda promocional por colección, bajo el hero.
function PromoBand() {
  return Object.entries(COLLECTIONS).map(([slug, collection]) =>
    collection.image ? (
      <ImageBand key={slug} slug={slug} collection={collection} />
    ) : (
      <ColorBand key={slug} slug={slug} collection={collection} />
    ),
  );
}

export default PromoBand;
