import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CollectionBanner from "../../components/product/CollectionBanner";
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
        setProducts(
          all.filter((p) => p.name.toLowerCase().includes(collection.match)),
        ),
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
    <div
      className="min-h-[60vh]"
      style={{
        backgroundColor: collection.theme.page,
        color: collection.theme.ink,
        "--card-ink": collection.theme.ink,
        "--card-accent": collection.theme.accent,
      }}
    >
      <CollectionBanner
        collection={collection}
        count={loading || error ? null : products.length}
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {loading && <p className="opacity-70">Cargando productos...</p>}
        {error && <p className="text-accent">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="opacity-70">Esta colección aún no tiene productos.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Collection;
