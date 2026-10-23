import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BagIcon from "../icons/BagIcon";
import { Dock, DockIcon, DockText } from "./Dock";
import MenuIcon from "../icons/MenuIcon";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";
import MobileMenu from "./MobileMenu";
import SocialDock from "./SocialDock";
import SearchPanel from "../search/SearchPanel";
import { useAccountPanel } from "../../context/AccountPanelContext";
import { useCart } from "../../context/CartContext";
import { getCategories } from "../../services/category.service";

const SCROLL_THRESHOLD = 40;
// Fracción del alto de la ventana a partir de la cual aparece el header deslizante en la landing.
const HERO_FRACTION = 0.85;
// Alto del header sin compactar: el espaciador lo reserva para que el contenido no salte al compactarse.
const HEADER_HEIGHT_CLASS = "h-[84px] lg:h-[127px]";

// Contenido del header (logo, menú, íconos). Se usa en el header normal y en el que se desliza
// sobre la landing, por eso recibe los manejadores desde SiteHeader.
function HeaderBar({
  compact,
  categories,
  count,
  onMenu,
  onSearch,
  onAccount,
  onCart,
}) {
  // Enlaces de sección repartidos a ambos lados del logo (como en Hermes).
  const links = [
    { to: "/catalogo", label: "Tienda" },
    ...categories.map((c) => ({
      to: `/catalogo?categoria=${c.slug}`,
      label: c.name,
    })),
  ];
  const middle = Math.ceil(links.length / 2);
  const navClass =
    "hidden flex-1 items-center justify-between font-display text-sm uppercase tracking-[0.1em] lg:flex";

  return (
    <div
      className={`mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-5 px-6 transition-[padding] duration-200 ${compact ? "py-3" : "py-6 lg:pb-4 lg:pt-9"}`}
    >
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menú"
          className="lg:hidden"
        >
          <MenuIcon />
        </button>
        <nav className={navClass}>
          {links.slice(0, middle).map((link) => (
            <Link key={link.to} to={link.to} className="hover-underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center lg:px-6">
        <Link
          to="/"
          className={`font-condensed font-semibold uppercase tracking-[0.06em] leading-none transition-[font-size] duration-200 ${compact ? "text-3xl" : "text-4xl"}`}
        >
          <DockText text="Ruby." magnification={1.3} distance={50} />
        </Link>
        {!compact && <SocialDock className="mt-3 hidden lg:flex" />}
      </div>

      <div className="flex items-center justify-end gap-10">
        <nav className={navClass}>
          {links.slice(middle).map((link) => (
            <Link key={link.to} to={link.to} className="hover-underline">
              {link.label}
            </Link>
          ))}
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
  );
}

// Header único del sitio. `overlay` lo superpone al hero de la landing y, al pasar el hero, un
// segundo header compacto se desliza desde arriba (como el de Hermes); `dark` elige el tema.
function SiteHeader({ overlay = false, dark = true }) {
  const { count, open: openCart } = useCart();
  const { open: openAccount } = useAccountPanel();
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  // Al bajar, el header se compacta; en la landing, además, aparece el header deslizante.
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      setPastHero(window.scrollY > window.innerHeight * HERO_FRACTION);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
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
    categories,
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
            className={`fixed inset-x-0 top-0 z-40 bg-black/85 transition-[transform,visibility] duration-300 ease-out ${blur} ${theme} ${
              pastHero ? "visible translate-y-0" : "invisible -translate-y-full"
            }`}
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
      {menuOpen && (
        <MobileMenu
          categories={categories}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default SiteHeader;
