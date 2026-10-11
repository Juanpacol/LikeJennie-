import { Link } from "react-router-dom";
import heroImage from "../../assets/jennie-hero.jpg";

function JennieHero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-black text-white">
      <img
        src={heroImage}
        alt="Ruby."
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />

      <p className="absolute left-6 top-6 font-script text-4xl sm:left-10 sm:top-8 sm:text-5xl">
        Ruby.
      </p>

      <div className="absolute bottom-16 left-1/2 w-full max-w-sm -translate-x-1/2 px-4 text-center">
        <h1 className="font-script text-6xl leading-none sm:text-7xl">Ruby.</h1>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/catalogo"
            className="border border-white/70 px-6 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Ver catálogo
          </Link>
          <a
            href="#destacados"
            className="border border-white/70 px-6 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Ver destacados
          </a>
          <a
            href="#contacto"
            className="border border-white/70 px-6 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Contacto
          </a>
        </div>
      </div>
    </section>
  );
}

export default JennieHero;
