import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/collections";

// Banda con foto (colección con `image`): en móvil la foto va de fondo con capa oscura y texto
// blanco; desde md el texto queda a la izquierda sobre el color de la colección y la foto a la
// derecha, fundida con un degradado, para que no se recorte ni se vea borrosa.
function ImageBand({ slug, collection }) {
  const { page, ink, accent, onAccent } = collection.theme;
  const {
    imageSide = "right",
    imageWidth = 600,
    imagePosition = "50% 30%",
  } = collection;
  const isLeft = imageSide === "left";
  const colors = {
    "--ink": ink,
    "--accent": accent,
    "--on-accent": onAccent,
    "--page": page,
  };

  return (
    <section
      className="relative overflow-hidden bg-black px-6 py-20 text-center text-white md:flex md:min-h-[440px] md:items-center md:bg-[color:var(--page)] md:py-24 md:text-left md:text-[color:var(--ink)]"
      style={{
        ...colors,
        // Colecciones oscuras: una línea fina del acento separa la banda de las secciones negras.
        ...(collection.divider && {
          borderTop: `1px solid ${accent}66`,
          borderBottom: `1px solid ${accent}66`,
        }),
      }}
    >
      {/* Móvil: la foto de fondo, oscurecida. */}
      <img
        src={collection.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_25%] md:hidden"
      />
      <div className="absolute inset-0 bg-black/50 md:hidden" />

      {/* Desde md: la foto entera a un lado, fundida con el color de la banda. */}
      <div
        className={`absolute inset-y-0 hidden md:block ${isLeft ? "md:left-[8%]" : "md:right-[8%]"}`}
        style={{ width: `min(${imageWidth}px, 55%)` }}
      >
        <img
          src={collection.image}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to ${isLeft ? "left" : "right"}, ${page} 0%, transparent 40%, transparent 85%, ${page} 100%)`,
          }}
        />
      </div>

      <div
        className={`relative mx-auto max-w-6xl md:flex md:w-full md:px-6 ${isLeft ? "md:justify-end" : ""}`}
      >
        <div className="md:max-w-lg">
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
            className="btn-sweep mt-8 inline-block bg-white px-8 py-3 font-display text-xs uppercase tracking-widest text-black [--sweep:rgb(0_0_0/0.12)] md:bg-[color:var(--accent)] md:text-[color:var(--on-accent)] md:[--sweep:rgb(255_255_255/0.35)]"
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
        className="btn-sweep mt-8 inline-block px-8 py-3 font-display text-xs uppercase tracking-widest"
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
