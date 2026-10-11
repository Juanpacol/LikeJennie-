import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../../components/product/ProductCard";
import JennieHero from "../../components/home/JennieHero";

function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getCatalog()
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <>
      <JennieHero />

      {featured.length > 0 && (
        <section id="destacados" className="mx-auto max-w-6xl px-4 py-16">
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
