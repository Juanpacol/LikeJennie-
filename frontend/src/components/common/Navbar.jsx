import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { count, open } = useCart();
  const { pathname } = useLocation();
  const isStore = pathname === "/catalogo" || pathname.startsWith("/productos/");

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
        <button type="button" onClick={open} className={`text-sm ${isStore ? "font-display" : ""}`}>
          Carrito ({count})
        </button>
      </div>
    </header>
  );
}

export default Navbar;
