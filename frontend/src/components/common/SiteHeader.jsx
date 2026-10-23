import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BagIcon from "../icons/BagIcon";
import { Dock, DockIcon, DockText } from "./Dock";
import MenuIcon from "../icons/MenuIcon";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";
import MobileMenu from "./MobileMenu";
import SearchPanel from "../search/SearchPanel";
import { useAccountPanel } from "../../context/AccountPanelContext";
import { useCart } from "../../context/CartContext";
import { COLLECTIONS } from "../../data/collections";

const SCROLL_THRESHOLD = 40;
// Fracción del alto de la ventana a partir de la cual aparece el header deslizante en la landing.
const HERO_FRACTION = 0.85;
// Alto del header sin compactar: el espaciador lo reserva para que el contenido no salte al compactarse.
const HEADER_HEIGHT_CLASS = "h-[68px] lg:h-[88px]";

// Menú de colecciones: se abre al pasar el mouse o con el teclado (focus-within) y enlaza a la página de
// cada colección, con un punto del color de su tema.
function CollectionsMenu() {
  return (
    <div className="group relative hidden lg:block">
      <button
        type="button"
        className="hover-underline flex items-center gap-1.5 py-2"
        aria-haspopup="true"
      >
        Colecciones
        <svg
          viewBox="0 0 10 6"
          className="h-1.5 w-2.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      <ul className="invisible absolute right-0 top-full z-50 w-64 translate-y-1 border border-white/15 bg-[#0b0b0b] p-2 text-white opacity-0 shadow-2xl transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {Object.entries(COLLECTIONS).map(([slug, collection]) => (
          <li key={slug}>
            <Link
              to={`/colecciones/${slug}`}
              className="flex items-center gap-3 px-3 py-3 transition hover:bg-white/10"
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    collection.theme.page === "#000000"
                      ? collection.theme.accent
                      : collection.theme.page,
                }}
              />
              <span className="flex flex-col">
                <span className="font-display text-sm uppercase tracking-[0.1em]">
                  {collection.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {collection.tagline}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Contenido del header: logo a la izquierda; a la derecha, Tienda, el menú de Colecciones y los íconos.
// Se usa en el header normal y en el que se desliza sobre la landing, por eso recibe los manejadores
// desde SiteHeader.
function HeaderBar({ compact, count, onMenu, onSearch, onAccount, onCart }) {
  return (
    // Mismo ancho y márgenes que el hero (max-w-7xl dentro de px-10) para que el logo quede alineado con su texto.
    <div className="px-6 sm:px-10">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-5 transition-[padding] duration-200 ${compact ? "py-3" : "py-5 lg:py-6"}`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Abrir menú"
            className="lg:hidden"
          >
            <MenuIcon />
          </button>
          <Link
            to="/"
            className={`font-condensed font-semibold uppercase tracking-[0.06em] leading-none transition-[font-size] duration-200 ${compact ? "text-3xl" : "text-4xl"}`}
          >
            <DockText text="Ruby." magnification={1.3} distance={50} />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <nav className="hidden items-center gap-10 font-display text-sm uppercase tracking-[0.1em] lg:flex">
            <Link to="/catalogo" className="hover-underline py-2">
              Tienda
            </Link>
            <CollectionsMenu />
          </nav>
          <Dock>
            <DockIcon>
              <button
                type="button"
                onClick={onSearch}
                aria-label="Buscar"
                className="h-full w-full"
              >
                <SearchIcon className="h-full w-full" />
              </button>
            </DockIcon>
            <DockIcon>
              <button
                type="button"
                onClick={onAccount}
                aria-label="Cuenta"
                className="h-full w-full"
              >
                <UserIcon className="h-full w-full" />
              </button>
            </DockIcon>
            <DockIcon>
              <button
                type="button"
                onClick={onCart}
                aria-label={`Carrito (${count})`}
                className="h-full w-full"
              >
                <BagIcon className="h-full w-full" />
              </button>
              {count > 0 && (
                <span className="pointer-events-none absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none text-white">
                  {count}
                </span>
              )}
            </DockIcon>
          </Dock>
        </div>
      </div>
    </div>
  );
}

// Header único del sitio. `overlay` lo superpone al hero de la landing y, al pasar el hero, un
// segundo header compacto se desliza desde arriba (como el de Hermes); `dark` elige el tema.
function SiteHeader({ overlay = false, dark = true }) {
  const { count, open: openCart } = useCart();
  const { open: openAccount } = useAccountPanel();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  // En la landing, el header compacto se aclara cuando pasa sobre una sección clara (data-header-theme="light").
  const [overLight, setOverLight] = useState(false);

  // Al bajar, el header se compacta; en la landing, además, aparece el header deslizante.
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      setPastHero(window.scrollY > window.innerHeight * HERO_FRACTION);
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 4)
        .find((element) => !element.closest("header"));
      setOverLight(
        under?.closest("[data-header-theme]")?.dataset.headerTheme === "light",
      );
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const theme = dark
    ? "text-[color:var(--header-ink,#fff)]"
    : "border-gray-200 text-black";
  const blur = "border-b backdrop-blur-md";
  const background = dark
    ? scrolled
      ? "header-tint-strong"
      : "header-tint"
    : scrolled
      ? "bg-white/95"
      : "bg-white/80";
  const bar = {
    count,
    onMenu: () => setMenuOpen(true),
    onSearch: () => setSearchOpen(true),
    onAccount: openAccount,
    onCart: openCart,
  };

  return (
    <>
      {overlay ? (
        <>
          <header className={`absolute inset-x-0 top-0 z-20 ${theme}`}>
            <HeaderBar compact={false} {...bar} />
          </header>
          {/* Header compacto que se desliza desde arriba cuando el hero ya pasó. */}
          <header
            aria-hidden={!pastHero}
            className={`fixed inset-x-0 top-0 z-40 backdrop-blur-sm transition-[transform,visibility,background-color,color] duration-300 ease-out ${
              overLight ? "bg-white/85 text-black" : "bg-black/85 text-white"
            } ${pastHero ? "visible translate-y-0" : "invisible -translate-y-full"}`}
          >
            <HeaderBar compact {...bar} />
          </header>
        </>
      ) : (
        <>
          <div aria-hidden="true" className={HEADER_HEIGHT_CLASS} />
          <header
            className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${blur} ${theme} ${background}`}
          >
            <HeaderBar compact={scrolled} {...bar} />
          </header>
        </>
      )}

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}

export default SiteHeader;
