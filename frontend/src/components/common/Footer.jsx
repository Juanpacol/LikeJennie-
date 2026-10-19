import { Link, useLocation } from "react-router-dom";

function Footer() {
  const { pathname } = useLocation();
  const isStore = pathname === "/catalogo" || pathname.startsWith("/productos/");

  return (
    <footer
      id="contacto"
      className={`border-t ${isStore ? "border-white/10 bg-black text-white" : "border-gray-200"}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p
            className={
              isStore ? "font-script text-2xl" : "text-lg font-bold tracking-tight"
            }
          >
            Ruby.
          </p>
          <p className={`mt-1 text-sm ${isStore ? "text-white/60" : "text-gray-500"}`}>
            Streetwear con flow propio.
          </p>
        </div>
        <nav className={`flex gap-6 text-sm ${isStore ? "font-display text-white/80" : "text-gray-600"}`}>
          <Link to="/catalogo" className={isStore ? "hover:text-accent" : "hover:text-black"}>
            Catálogo
          </Link>
          <Link to="/admin/login" className={isStore ? "hover:text-accent" : "hover:text-black"}>
            Admin
          </Link>
        </nav>
      </div>
      <div
        className={`border-t py-4 text-center text-xs ${
          isStore ? "border-white/10 text-white/40" : "border-gray-100 text-gray-400"
        }`}
      >
        © {new Date().getFullYear()} Ruby. Proyecto académico.
      </div>
    </footer>
  );
}

export default Footer;
