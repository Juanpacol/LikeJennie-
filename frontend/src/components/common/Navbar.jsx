import { Link, useLocation } from "react-router-dom";
import BagIcon from "../icons/BagIcon";
import UserIcon from "../icons/UserIcon";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { count, open } = useCart();
  const { pathname } = useLocation();
  const isStore = pathname === "/catalogo";

  return (
    <header
      className={`border-b ${isStore ? "border-white/10 bg-black text-white" : "border-gray-200"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className={isStore ? "font-script text-2xl" : "text-xl font-bold tracking-tight"}
        >
          Ruby.
        </Link>
        <nav className={`flex gap-6 text-sm ${isStore ? "font-display" : ""}`}>
          <Link to="/catalogo">Catálogo</Link>
        </nav>
        <div className="flex items-center gap-5">
          <button type="button" aria-label="Cuenta">
            <UserIcon className="h-5 w-5" />
          </button>
          <button type="button" onClick={open} aria-label={`Carrito (${count})`} className="relative">
            <BagIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
