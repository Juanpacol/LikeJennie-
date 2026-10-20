import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { COLLECTIONS } from "../../data/collections";
import { getCatalog } from "../../services/product.service";

function Collection() {
  const { slug } = useParams();
  const collection = COLLECTIONS[slug];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collection) return;
    getCatalog()
      .then((all) =>
        setProducts(all.filter((p) => p.name.toLowerCase().includes(collection.match))),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [collection]);

  if (!collection) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16 text-white">
        <p>Colección no encontrada.</p>
        <Link to="/catalogo" className="mt-4 inline-block underline">
          Ver catálogo
        </Link>
      </section>
    );
  }

  return (
    <div className="bg-black text-white">
      <div className="bg-lilac px-6 py-14 text-center text-lilac-deep">
        <p className="font-display text-xs uppercase tracking-widest">Colección</p>
        <h1 className="mt-3 font-script text-6xl leading-none sm:text-7xl">{collection.title}</h1>
        <p className="mx-auto mt-4 max-w-md font-display text-sm">{collection.description}</p>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {loading && <p className="text-white/50">Cargando productos...</p>}
        {error && <p className="text-accent">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-white/50">Esta colección aún no tiene productos.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Collection;
