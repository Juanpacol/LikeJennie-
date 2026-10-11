import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contacto" className="border-t border-gray-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-lg font-bold tracking-tight">Ruby.</p>
          <p className="mt-1 text-sm text-gray-500">Streetwear con flow propio.</p>
        </div>
        <nav className="flex gap-6 text-sm text-gray-600">
          <Link to="/catalogo" className="hover:text-black">
            Catálogo
          </Link>
          <Link to="/admin/login" className="hover:text-black">
            Admin
          </Link>
        </nav>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Ruby. Proyecto académico.
      </div>
    </footer>
  );
}

export default Footer;
