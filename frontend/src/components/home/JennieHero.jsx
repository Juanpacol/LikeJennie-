import { Link } from "react-router-dom";
import { DockText } from "../common/Dock";
import heroPortrait from "../../assets/hero-portrait.jpg";

// Hero dividido (inspirado en el de Hermes): titular enorme en tipografía condensada a la
// izquierda y la foto enmarcada a la derecha, con "JENNIE" en script cruzando el borde de la foto.
function JennieHero() {
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
          <div className="relative aspect-[736/986] overflow-hidden rounded-sm bg-neutral-900 ring-1 ring-white/15">
            <img
              src={heroPortrait}
              alt="Jennie posando con una chaqueta de mezclilla, retrato en blanco y negro"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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
