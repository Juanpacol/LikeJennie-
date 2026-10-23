import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../product/ProductCard";
import eyes from "../../assets/cutouts/shop-eyes.webp";
import portrait from "../../assets/cutouts/shop-portrait.webp";
import face from "../../assets/cutouts/shop-face.webp";

const PER_TAB = 4;

// Piezas del collage de fondo (solo escritorio), repartidas por toda la sección y solapadas: tira de ojos en
// negativo a la izquierda, retrato sepia con marco claro junto al título, cara recortada en medios tonos a la
// derecha y, abajo, una banda ancha con los ojos recortada y muy tenue. `delay` escalona su entrada.
const COLLAGE = [
  {
    src: eyes,
    className:
      "left-[0.5%] top-[34%] w-32 -rotate-3 opacity-80 shadow-[0_18px_30px_rgba(0,0,0,0.55)]",
    delay: "0.3s",
  },
  {
    src: portrait,
    className:
      "right-[27%] top-20 w-52 rotate-[2.5deg] border-[6px] border-[#efe9dc] shadow-[0_22px_34px_rgba(0,0,0,0.6)]",
    delay: "0.45s",
  },
  {
    src: face,
    className: "right-[1.5%] -top-6 h-[31rem] w-auto max-w-none",
    style: {
      WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent)",
      maskImage: "linear-gradient(to bottom, #000 55%, transparent)",
    },
    delay: "0.6s",
  },
  {
    src: eyes,
    className:
      "inset-x-0 bottom-0 h-64 w-full object-cover object-[50%_14%] opacity-25 mix-blend-screen",
    style: {
      WebkitMaskImage:
        "linear-gradient(to top, transparent, #000 22%, #000 40%, transparent)",
      maskImage:
        "linear-gradient(to top, transparent, #000 22%, #000 40%, transparent)",
    },
    delay: "0.2s",
  },
];

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
      {/* Fondo de collage estilo fotocopia repartido por toda la sección; el contenido va por encima (z-10). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        {COLLAGE.map((piece) => (
          <img
            key={`${piece.src}-${piece.delay}`}
            src={piece.src}
            alt=""
            loading="lazy"
            className={`shop-piece absolute ${piece.className}`}
            style={{ ...piece.style, "--piece-delay": piece.delay }}
          />
        ))}
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
          Tienda
        </p>
        <h2 className="mt-3 font-condensed text-7xl font-light uppercase tracking-[-0.01em] sm:text-8xl">
          Be unique
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
