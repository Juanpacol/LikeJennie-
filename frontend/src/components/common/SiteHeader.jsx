import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BagIcon from "../icons/BagIcon";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";
import SearchPanel from "../search/SearchPanel";
import { useAccountPanel } from "../../context/AccountPanelContext";
import { useCart } from "../../context/CartContext";
import { getCategories } from "../../services/category.service";

// Header único del sitio. `overlay` lo superpone al hero de la landing; `dark` elige el tema.
function SiteHeader({ overlay = false, dark = true }) {
  const { count, open: openCart } = useCart();
  const { open: openAccount } = useAccountPanel();
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const position = overlay ? "absolute inset-x-0 top-0 z-10" : "sticky top-0 z-40 border-b backdrop-blur-md";
  const theme = dark ? "border-white/10 text-white" : "border-gray-200 text-black";
  const background = overlay ? "" : dark ? "bg-black/60" : "bg-white/80";

  return (
    <header className={`${position} ${theme} ${background}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6">
        <Link to="/" className="font-script text-4xl leading-none">
          Ruby.
        </Link>

        <nav className="hidden flex-1 justify-center gap-8 font-display text-xs uppercase tracking-widest md:flex">
          <Link to="/catalogo" className="hover:opacity-70">
            Tienda
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalogo?categoria=${category.slug}`}
              className="hover:opacity-70"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar"
            className="hover:opacity-70"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
          <button type="button" onClick={openAccount} aria-label="Cuenta" className="hover:opacity-70">
            <UserIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Carrito (${count})`}
            className="relative hover:opacity-70"
          >
            <BagIcon className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </header>
  );
}

export default SiteHeader;
