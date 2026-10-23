import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { getCatalog } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";

const MAX_RESULTS = 5;

// Panel de búsqueda: carga el catálogo una vez y filtra por nombre en el cliente.
function SearchPanel({ onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCatalog()
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const term = query.trim().toLowerCase();
  const results = term
    ? products.filter((product) => product.name.toLowerCase().includes(term))
    : [];

  // En un portal: dentro del header (con backdrop-filter) el panel quedaba atrapado en su alto.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 sm:pt-24">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <section
        role="dialog"
        aria-label="Buscar"
        className="relative max-h-[calc(100dvh-6rem)] w-full max-w-xl overflow-y-auto border border-white/15 bg-[#0b0b0b] p-5 text-white shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
              Ruby.
            </p>
            <h2 className="mt-2 font-condensed text-4xl font-light uppercase leading-none">
              Buscar
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/30 text-lg leading-none transition hover:bg-white hover:text-black"
          >
            ×
          </button>
        </div>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre del producto"
          aria-label="Buscar productos"
          className="mt-6 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 font-display text-base text-white placeholder:text-white/40 transition-colors focus:border-accent focus:outline-none"
        />

        {error && <p className="mt-4 text-sm text-accent">{error}</p>}

        {term && !error && results.length === 0 && (
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            Sin resultados para “{query.trim()}”.
          </p>
        )}

        {results.length > 0 && (
          <>
            <ul className="mt-4 divide-y divide-white/10">
              {results.slice(0, MAX_RESULTS).map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/productos/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 transition hover:opacity-70"
                  >
                    <img
                      src={product.images[0]?.url}
                      alt=""
                      className="h-16 w-12 shrink-0 bg-[#141414] object-cover"
                    />
                    <span className="min-w-0 flex-1 font-display text-sm uppercase leading-snug tracking-wide">
                      {product.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs">
                      {formatPrice(product.salePrice ?? product.basePrice)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/catalogo"
              onClick={onClose}
              className="hover-underline mx-auto mt-5 block w-fit font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white"
            >
              Ver todo el catálogo
            </Link>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}

export default SearchPanel;
