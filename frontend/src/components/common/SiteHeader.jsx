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
import { getCategories } from "../../services/category.service";

const SCROLL_THRESHOLD = 40;
// Fracción del alto de la ventana a partir de la cual aparece el header deslizante en la landing.
const HERO_FRACTION = 0.85;
// Alto del header sin compactar: el espaciador lo reserva para que el contenido no salte al compactarse.
const HEADER_HEIGHT_CLASS = "h-[84px]";

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
  return (
    <div
      className={`mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 transition-[padding] duration-200 ${compact ? "py-3" : "py-6"}`}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menú"
          className="md:hidden"
        >
          <MenuIcon />
        </button>
        <Link
          to="/"
          className={`font-script leading-none transition-[font-size] duration-200 ${compact ? "text-3xl" : "text-4xl"}`}
        >
          <DockText text="Ruby." magnification={1.3} distance={50} />
        </Link>
      </div>

      <nav className="hidden flex-1 justify-center gap-8 font-display text-xs uppercase tracking-widest md:flex">
        <Link to="/catalogo" className="hover-underline">
          Tienda
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/catalogo?categoria=${category.slug}`}
            className="hover-underline"
          >
            {category.name}
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
    ? "border-white/10 text-white"
    : "border-gray-200 text-black";
  const blur = "border-b backdrop-blur-md";
  const background = dark
    ? scrolled
      ? "bg-black/85"
      : "bg-black/60"
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
          <header className={`absolute inset-x-0 top-0 z-10 ${theme}`}>
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
