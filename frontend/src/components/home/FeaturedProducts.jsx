import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../product/ProductCard";

const FEATURED_COUNT = 8;

// Primeros productos del catálogo como vitrina de la landing.
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCatalog()
      .then((all) => setProducts(all.slice(0, FEATURED_COUNT)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl">Destacados</h2>

        {loading && <p className="mt-8 text-white/50">Cargando productos...</p>}
        {error && <p className="mt-8 text-accent">{error}</p>}

        {!loading && !error && (
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/catalogo"
            className="inline-block border border-white/70 px-8 py-3 font-display text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Ver todo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
