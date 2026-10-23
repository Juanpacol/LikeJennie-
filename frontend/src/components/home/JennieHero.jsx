import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroCenter from "../../assets/hero-center.jpg";
import heroLeft from "../../assets/hero-left.jpg";
import heroRight from "../../assets/hero-right.jpg";

// Las tres imágenes del hero, de izquierda a derecha. `position` encuadra el rostro en cada franja.
const STRIPS = [
  {
    src: heroLeft,
    position: "50% 20%",
    alt: "Retrato en blanco y negro con grano de película",
  },
  {
    src: heroCenter,
    position: "40% 30%",
    alt: "Bailarina con gafas oscuras sobre fondo rojo",
  },
  {
    src: heroRight,
    position: "52% 20%",
    alt: "Jennie posando con una chaqueta de mezclilla, retrato en blanco y negro",
  },
];

// Espera a que carguen las tres fotos (o 2,5 s como máximo) para empezar la revelación.
function useImagesReady(sources) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const loads = sources.map(
      (src) =>
        new Promise((resolve) => {
          const image = new Image();
          image.onload = image.onerror = resolve;
          image.src = src;
        }),
    );
    const timeout = new Promise((resolve) => setTimeout(resolve, 2500));
    Promise.race([Promise.all(loads), timeout]).then(
      () => !cancelled && setReady(true),
    );
    return () => {
      cancelled = true;
    };
  }, [sources]);
  return ready;
}

const SOURCES = STRIPS.map((strip) => strip.src);

// Hero a pantalla completa (inspirado en offform.net): tres fotos que ocupan todo el ancho y se
// revelan de arriba hacia abajo una tras otra, con el titular condensado encima.
function JennieHero() {
  const ready = useImagesReady(SOURCES);

  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-black px-6 pb-16 pt-32 text-white sm:px-10">
      {/* Las tres fotos a pantalla completa, una junto a otra, como en el hero de offform.net. */}
      <div
        className={`absolute inset-0 grid grid-cols-3 gap-px bg-black ${ready ? "is-revealing" : ""}`}
      >
        {STRIPS.map((strip, index) => (
          <div
            key={strip.src}
            className="hero-strip relative overflow-hidden bg-neutral-900"
            style={{ "--strip-index": index }}
          >
            <img
              src={strip.src}
              alt={strip.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: strip.position }}
            />
          </div>
        ))}
      </div>
      {/* Degradado para que el titular se lea sobre las fotos. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85),rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.35))]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
            Colección 2026 · Ruby.
          </p>

          <h1 className="mt-5 font-condensed text-[clamp(3.6rem,10.5vw,9.5rem)] font-light uppercase leading-[0.92] tracking-[-0.02em]">
            Wanna
            <br />
            rock with
            <br />
            <span className="text-accent">this?</span>
          </h1>

          <p className="mt-6 max-w-md font-display text-sm text-white/80 sm:text-base">
            Prendas, accesorios y música inspirados en el estilo de Jennie.
            Elige tu mundo y llévalo puesto.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="btn-sweep bg-white px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-black [--sweep:rgb(0_0_0/0.12)]"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JennieHero;
