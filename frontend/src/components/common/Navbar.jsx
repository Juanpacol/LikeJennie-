import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { count, open } = useCart();

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Ruby.
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link to="/catalogo">Catálogo</Link>
        </nav>
        <button type="button" onClick={open} className="text-sm">
          Carrito ({count})
        </button>
      </div>
    </header>
  );
}

export default Navbar;
