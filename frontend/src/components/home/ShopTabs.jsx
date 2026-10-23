import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../product/ProductCard";
import stage from "../../assets/cutouts/shop-stage.webp";

const PER_TAB = 4;
// La foto de contraluz se desvanece por la izquierda, arriba y abajo (sin marcar su rectángulo).
const STAGE_MASK_IMAGE =
  "linear-gradient(to right, transparent, #000 55%), linear-gradient(to bottom, transparent, #000 14%, #000 80%, transparent)";
const STAGE_MASK = {
  WebkitMaskImage: STAGE_MASK_IMAGE,
  WebkitMaskComposite: "source-in",
  maskImage: STAGE_MASK_IMAGE,
  maskComposite: "intersect",
};

// Tienda de la landing con pestañas: Todo y una por categoría, con 4 productos cada una. Carga el
// catálogo una vez y filtra en el cliente, así cambiar de pestaña no hace peticiones. "Todo" muestra
// un producto de cada categoría (en vez de los más recientes) para dar una muestra variada.
function ShopTabs() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getCategories(), getCatalog()])
      .then(([cats, all]) => {
        setCategories(cats);
        setProducts(all);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    if (selected) {
      return products
        .filter((p) => p.category?.slug === selected)
        .slice(0, PER_TAB);
    }
    // Un producto por categoría, en el orden de las pestañas; si faltan, se completa con los recientes.
    const sample = categories
      .map((c) => products.find((p) => p.category?.slug === c.slug))
      .filter(Boolean);
    const rest = products.filter((p) => !sample.includes(p));
    return [...sample, ...rest].slice(0, PER_TAB);
  }, [categories, products, selected]);

  const tabClass = (active) =>
    `shrink-0 border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
      active
        ? "border-accent text-white"
        : "border-transparent text-white/50 hover:text-white"
    }`;

  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 text-white">
      {/* Foto a contraluz en blanco y negro como fondo de toda la sección: ocupa el alto completo a la derecha y se
          desvanece hacia la izquierda y por arriba y abajo. Su fondo casi negro se mezcla con la sección (screen).
          Las tarjetas y el título van por encima (z-10). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] lg:block"
      >
        <img
          src={stage}
          alt=""
          loading="lazy"
          className="shop-kneel h-full w-full object-cover object-[50%_18%] opacity-80 mix-blend-screen [filter:brightness(0.9)_contrast(1.25)]"
          style={{ ...STAGE_MASK }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
          Tienda
        </p>
        <h2 className="mt-3 font-condensed text-6xl font-light uppercase tracking-[-0.01em] sm:text-7xl">
          Elige lo tuyo
        </h2>

        <div
          role="tablist"
          aria-label="Categorías"
          className="no-scrollbar mt-8 flex gap-8 overflow-x-auto border-b border-white/10"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selected === null}
            onClick={() => setSelected(null)}
            className={tabClass(selected === null)}
          >
            Todo
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected === category.slug}
              onClick={() => setSelected(category.slug)}
              className={tabClass(selected === category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {Array.from({ length: PER_TAB }, (_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-lg bg-neutral-900"
              />
            ))}
          </div>
        )}
        {error && <p className="mt-8 text-accent">{error}</p>}

        {!loading && !error && (
          <div
            key={selected ?? "todo"}
            role="tabpanel"
            className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {visible.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to={selected ? `/catalogo?categoria=${selected}` : "/catalogo"}
            className="btn-sweep inline-block border border-white/70 px-8 py-3 font-display text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
          >
            Ver todo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ShopTabs;
