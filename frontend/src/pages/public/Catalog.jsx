import { useEffect, useState } from "react";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../../components/product/ProductCard";
import FilterBar from "../../components/product/FilterBar";

function Catalog() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCatalog(selectedCategory)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Catálogo</h1>

      <FilterBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      {loading && <p className="mt-8 text-gray-500">Cargando productos...</p>}
      {error && <p className="mt-8 text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="mt-8 text-gray-500">No hay productos en esta categoría.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Catalog;
