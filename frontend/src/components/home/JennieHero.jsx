import { useCart } from "../../context/CartContext";
import heroImage from "../../assets/jennie-hero.jpg";

const SOCIAL_ICONS = [
  { label: "Música", d: "M9 18V5l10-2v11" },
  { label: "Fotos", d: "M4 7h16v12H4z M4 7l4-4h8l4 4" },
  { label: "Video", d: "M4 5h12v14H4z M16 9l4-2v10l-4-2" },
];

function JennieHero() {
  const { count, open } = useCart();

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black text-white">
      <img
        src={heroImage}
        alt="Ruby."
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <p className="font-script text-4xl sm:text-5xl">Ruby.</p>
        <nav className="flex gap-6 text-xs uppercase tracking-widest sm:gap-8">
          <a href="#tienda" className="hover:text-white/70">
            Tienda
          </a>
          <button type="button" onClick={open} className="hover:text-white/70">
            Carrito ({count})
          </button>
          <a href="#contacto" className="hover:text-white/70">
            Contacto
          </a>
        </nav>
      </header>

      <ul className="absolute bottom-10 left-6 flex flex-col gap-4 sm:left-10">
        {SOCIAL_ICONS.map((icon) => (
          <li key={icon.label}>
            <span aria-label={icon.label} title={icon.label} className="block text-white/80">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d={icon.d} />
              </svg>
            </span>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-16 left-1/2 w-full max-w-sm -translate-x-1/2 px-4 text-center">
        <h1 className="font-script text-6xl leading-none sm:text-7xl">Ruby.</h1>
        <div className="mt-8 flex flex-col gap-3">
          <a
            href="#tienda"
            className="border border-white/70 px-6 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Ver tienda
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
