import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DockText } from "../common/Dock";
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

// Hero dividido (inspirado en el de Hermes): titular enorme en tipografía condensada a la
// izquierda y, a la derecha, la foto partida en tres franjas que se revelan de arriba hacia abajo
// una tras otra (idea de offform.net), con "JENNIE" en script cruzando el borde.
function JennieHero() {
  const ready = useImagesReady(SOURCES);

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-black px-6 pb-16 pt-32 text-white sm:px-10 lg:pt-44">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        <div className="relative z-10">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-white/60">
            Colección 2026 · Ruby.
          </p>

          <h1 className="mt-5 font-condensed text-[clamp(3.6rem,10.5vw,9.5rem)] font-light uppercase leading-[0.92] tracking-[-0.02em]">
            Wanna
            <br />
            rock with
            <br />
            <span className="text-accent">this?</span>
          </h1>

          <p className="mt-6 max-w-md font-display text-sm text-white/70 sm:text-base">
            Prendas, accesorios y música inspirados en el estilo de Jennie.
            Elige tu mundo y llévalo puesto.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="btn-sweep bg-white px-8 py-3 font-display text-xs uppercase tracking-widest text-black [--sweep:rgb(0_0_0/0.12)]"
            >
              Ver tienda
            </Link>
            <Link
              to="/colecciones/fallen-angel"
              className="border border-white/40 px-8 py-3 font-display text-xs uppercase tracking-widest transition hover:border-white hover:bg-white hover:text-black"
            >
              Colecciones
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0 lg:max-w-[calc((100vh-14rem)*736/986)]">
          <div
            className={`relative grid aspect-[736/986] grid-cols-3 gap-1 overflow-hidden rounded-sm bg-neutral-950 ring-1 ring-white/15 ${ready ? "is-revealing" : ""}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          <p className="pointer-events-none absolute -bottom-6 -left-4 z-10 whitespace-nowrap font-script text-[clamp(3.5rem,7vw,6.5rem)] leading-none text-white mix-blend-difference lg:-left-20">
            <span className="pointer-events-auto">
              <DockText text="JENNIE" magnification={1.4} distance={80} />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default JennieHero;
