import { Link } from "react-router-dom";
import { SOCIAL_ICONS } from "../../data/socialLinks";
import heroImage from "../../assets/jennie-hero.jpg";

function JennieHero() {
  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black text-white">
      <img
        src={heroImage}
        alt="Jennie posando para la campaña Ruby, cabello rojo sobre fondo negro"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

      <ul className="absolute bottom-10 left-6 flex flex-col gap-4 sm:left-10">
        {SOCIAL_ICONS.map((icon) => (
          <li key={icon.platform} className="group relative">
            <a
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.platform}
              className="block text-white/80 transition group-hover:text-white"
              style={{ "--brand-color": icon.brandColor }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current transition group-hover:fill-[var(--brand-color)]"
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
          </li>
        ))}
      </ul>

      <div className="absolute bottom-16 left-1/2 w-full max-w-sm -translate-x-1/2 px-4 text-center">
        <h1 className="font-script text-6xl leading-none sm:text-7xl">Ruby.</h1>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/catalogo"
            className="border border-white/70 px-6 py-3 font-display text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Ver tienda
          </Link>
        </div>
      </div>
    </section>
  );
}

export default JennieHero;
