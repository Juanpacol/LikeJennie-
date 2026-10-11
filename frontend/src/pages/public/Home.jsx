import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../../components/product/ProductCard";

function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getCatalog()
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight">Ruby.</h1>
          <p className="mt-4 max-w-md text-gray-600">
            Streetwear con flow propio. Piezas limitadas, caída urbana.
          </p>
          <Link
            to="/catalogo"
            className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Destacados
            </h2>
            <Link to="/catalogo" className="text-sm underline underline-offset-4">
              Ver todo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
