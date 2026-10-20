import { useEffect, useState } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <section
        role="dialog"
        aria-label="Buscar"
        className="relative w-full max-w-xl rounded-3xl bg-lilac p-6 font-display text-lilac-deep shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos"
            aria-label="Buscar productos"
            className="w-full border border-lilac-deep/50 bg-white/80 px-4 py-3 text-sm placeholder:text-lilac-deep/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-white/70 text-lg leading-none transition hover:bg-white"
          >
            ×
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-accent">{error}</p>}

        {term && !error && results.length === 0 && (
          <p className="mt-4 text-sm">No encontramos productos para “{query.trim()}”.</p>
        )}

        {results.length > 0 && (
          <>
            <ul className="mt-4 divide-y divide-lilac-deep/15">
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
                      className="h-16 w-12 bg-white/40 object-cover"
                    />
                    <span className="flex-1 text-sm">{product.name}</span>
                    <span className="text-sm">
                      {formatPrice(product.salePrice ?? product.basePrice)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/catalogo"
              onClick={onClose}
              className="mt-4 block text-center text-xs uppercase tracking-widest underline"
            >
              Ver todo el catálogo
            </Link>
          </>
        )}
      </section>
    </div>
  );
}

export default SearchPanel;
