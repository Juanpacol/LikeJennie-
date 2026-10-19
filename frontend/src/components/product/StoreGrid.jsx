import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";

function StoreGrid() {
  const [categories, setCategories] = useState([]);
  // La categoría vive en la URL (?categoria=slug) para poder enlazarla desde el header.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("categoria");
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

  function handleSelect(slug) {
    setSearchParams(slug ? { categoria: slug } : {});
  }

  return (
    <>
      <FilterBar categories={categories} selected={selectedCategory} onSelect={handleSelect} />

      {loading && <p className="mt-8 text-white/50">Cargando productos...</p>}
      {error && <p className="mt-8 text-accent">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="mt-8 text-white/50">No hay productos en esta categoría.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default StoreGrid;
