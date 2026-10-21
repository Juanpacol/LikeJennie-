import { Link } from "react-router-dom";
import { Dock, DockIcon, DockText } from "../common/Dock";
import { SOCIAL_ICONS } from "../../data/socialLinks";
import heroPortrait from "../../assets/hero-portrait.jpg";

// Hero dividido (inspirado en el de Hermes): titular enorme en tipografía condensada a la
// izquierda y la foto enmarcada a la derecha, con "JENNIE" en script cruzando el borde de la foto.
function JennieHero() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-black px-6 pb-16 pt-28 text-white sm:px-10 lg:pt-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        <div className="relative z-10">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-white/60">
            Colección 2026 · Ruby.
          </p>

          <h1 className="mt-5 font-condensed text-[clamp(3.6rem,10.5vw,9.5rem)] font-light uppercase leading-[0.92] tracking-[-0.02em]">
            Streetwear
            <br />
            con <span className="text-accent">flow</span>
            <br />
            propio.
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

        <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0 lg:max-w-[calc((100vh-9rem)*736/986)]">
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

      <Dock
        direction="vertical"
        size={20}
        magnification={30}
        distance={80}
        className="absolute bottom-10 left-6 hidden sm:flex sm:left-10"
      >
        {SOCIAL_ICONS.map((icon) => (
          <DockIcon key={icon.platform} className="group">
            <a
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.platform}
              className="block h-full w-full text-white/80 transition group-hover:text-white"
              style={{ "--brand-color": icon.brandColor }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-full w-full fill-current transition group-hover:fill-[var(--brand-color)]"
              >
                <path d={icon.d} />
              </svg>
            </a>

            <div
              className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100"
              role="tooltip"
            >
              <span className="font-display text-xs text-black">
                {icon.platform}
              </span>
            </div>
          </DockIcon>
        ))}
      </Dock>
    </section>
  );
}

export default JennieHero;
