import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";

const GRID_CLASS =
  "mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4";
const SKELETON_COUNT = 8;

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
      <FilterBar
        categories={categories}
        selected={selectedCategory}
        onSelect={handleSelect}
        total={loading ? null : products.length}
      />

      {error && <p className="mt-10 font-display text-accent">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          No hay productos en esta categoría.
        </p>
      )}

      {/* Primera carga: tarjetas-esqueleto que respiran en lugar de un texto. */}
      {loading && products.length === 0 && (
        <div className={GRID_CLASS}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] animate-pulse bg-neutral-900" />
              <div className="mt-4 h-3 w-3/4 animate-pulse bg-neutral-900" />
              <div className="mt-2 h-3 w-1/4 animate-pulse bg-neutral-900" />
            </div>
          ))}
        </div>
      )}

      {/* Al cambiar de categoría los productos anteriores se atenúan hasta que llegan los nuevos,
          y las tarjetas nuevas aparecen otra vez con su animación (la key cambia con el filtro). */}
      {!error && products.length > 0 && (
        <div
          key={selectedCategory ?? "todos"}
          className={`${GRID_CLASS} transition-opacity duration-300 ${
            loading ? "pointer-events-none opacity-40" : "opacity-100"
          }`}
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </>
  );
}

export default StoreGrid;
