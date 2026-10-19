import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import BagIcon from "../icons/BagIcon";
import UserIcon from "../icons/UserIcon";
import heroImage from "../../assets/jennie-hero.jpg";

const SOCIAL_ICONS = [
  {
    platform: "Spotify",
    href: "https://open.spotify.com/artist/250b0Wlc5Vk0CoUsaCY84M",
    brandColor: "#1DB954",
    d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.26-1.32 9.6-.66 13.26 1.56.42.18.6.84.48 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.76 5.939 16.26 6.24 20.4 8.68c.479.3.6.9.3 1.5-.3.421-.9.6-1.32.3z",
  },
  {
    platform: "Instagram",
    href: "https://www.instagram.com/jennierubyjane/",
    brandColor: "#E1306C",
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    platform: "YouTube",
    href: "https://www.youtube.com/channel/UCNYi_zGmR519r5gYdOKLTjQ",
    brandColor: "#FF0000",
    d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

function JennieHero() {
  const { count, open } = useCart();

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black text-white">
      <img
        src={heroImage}
        alt="Jennie posando para la campaña Ruby, cabello rojo sobre fondo negro"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <p className="font-script text-4xl sm:text-5xl">Ruby.</p>
        <nav className="flex items-center gap-6 font-display text-xs uppercase tracking-widest sm:gap-8">
          <Link to="/catalogo" className="hover:text-white/70">
            Tienda
          </Link>
          <button type="button" aria-label="Cuenta" className="hover:text-white/70">
            <UserIcon />
          </button>
          <button
            type="button"
            onClick={open}
            aria-label={`Carrito (${count})`}
            className="relative hover:text-white/70"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none">
                {count}
              </span>
            )}
          </button>
        </nav>
      </header>

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
              <span className="font-display text-xs text-black">{icon.platform}</span>
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
