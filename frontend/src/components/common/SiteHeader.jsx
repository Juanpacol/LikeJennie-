import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BagIcon from "../icons/BagIcon";
import { Dock, DockIcon, DockText } from "./Dock";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";
import SearchPanel from "../search/SearchPanel";
import { useAccountPanel } from "../../context/AccountPanelContext";
import { useCart } from "../../context/CartContext";
import { getCategories } from "../../services/category.service";

const SCROLL_THRESHOLD = 40;
// Alto del header sin compactar: el espaciador lo reserva para que el contenido no salte al compactarse.
const HEADER_HEIGHT_CLASS = "h-[84px]";

// Header único del sitio. `overlay` lo superpone al hero de la landing; `dark` elige el tema.
function SiteHeader({ overlay = false, dark = true }) {
  const { count, open: openCart } = useCart();
  const { open: openAccount } = useAccountPanel();
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Al bajar, el header se compacta (logo y relleno más pequeños, fondo más opaco).
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
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

  const position = overlay
    ? "absolute inset-x-0 top-0 z-10"
    : "fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-200";
  const theme = dark
    ? "border-white/10 text-white"
    : "border-gray-200 text-black";
  const background = overlay
    ? ""
    : dark
      ? scrolled
        ? "bg-black/85"
        : "bg-black/60"
      : scrolled
        ? "bg-white/95"
        : "bg-white/80";
  const compact = !overlay && scrolled;

  return (
    <>
      {!overlay && <div aria-hidden="true" className={HEADER_HEIGHT_CLASS} />}
      <header className={`${position} ${theme} ${background}`}>
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 transition-[padding] duration-200 ${compact ? "py-3" : "py-6"}`}
        >
          <Link
            to="/"
            className={`font-script leading-none transition-[font-size] duration-200 ${compact ? "text-3xl" : "text-4xl"}`}
          >
            <DockText text="Ruby." magnification={1.3} distance={50} />
          </Link>

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
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
                className="h-full w-full"
              >
                <SearchIcon className="h-full w-full" />
              </button>
            </DockIcon>
            <DockIcon>
              <button
                type="button"
                onClick={openAccount}
                aria-label="Cuenta"
                className="h-full w-full"
              >
                <UserIcon className="h-full w-full" />
              </button>
            </DockIcon>
            <DockIcon>
              <button
                type="button"
                onClick={openCart}
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
        {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      </header>
    </>
  );
}

export default SiteHeader;
