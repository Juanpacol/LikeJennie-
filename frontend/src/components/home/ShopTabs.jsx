import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";
import ProductCard from "../product/ProductCard";
import eyes from "../../assets/cutouts/shop-eyes.webp";
import zineA from "../../assets/cutouts/shop-zine-a.webp";
import zineB from "../../assets/cutouts/shop-zine-b.webp";
import face from "../../assets/cutouts/shop-face.webp";
import poster from "../../assets/cutouts/shop-poster.webp";

const PER_TAB = 4;

// Collage de la columna izquierda (solo escritorio), todo en blanco y negro de alto contraste (estilo
// fotocopia). Cada pieza se coloca según su postura: el afiche de la cadena arriba, mirando hacia la derecha; la
// cara asoma por la esquina superior derecha hacia los productos; el retrato del brazo en alto sube por el
// centro; los ojos lo cruzan por un lado; y la figura agachada, invertida, queda abajo estirando el brazo hacia
// la cuadrícula. Las cintas rojas son el acento de la marca. `delay` escalona su entrada.
const COLLAGE = [
  {
    src: poster,
    className:
      "left-[1%] top-[3%] w-[84%] -rotate-[2.5deg] shadow-[0_26px_40px_rgba(0,0,0,0.65)]",
    delay: "0.2s",
  },
  {
    src: zineA,
    className:
      "left-[6%] top-[37%] w-[40%] rotate-[3deg] border border-white/25 shadow-[0_26px_40px_rgba(0,0,0,0.7)]",
    delay: "0.4s",
  },
  {
    src: eyes,
    className:
      "right-[3%] top-[60%] w-[29%] rotate-[4deg] opacity-90 shadow-[0_22px_34px_rgba(0,0,0,0.65)]",
    delay: "0.55s",
  },
  {
    src: face,
    className: "-right-[9%] -top-[2%] h-[33%] w-auto max-w-none",
    style: {
      WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent)",
      maskImage: "linear-gradient(to bottom, #000 58%, transparent)",
    },
    delay: "0.7s",
  },
  {
    src: zineB,
    className:
      "bottom-[1%] left-[16%] w-[50%] -scale-x-100 rotate-[4deg] opacity-95 shadow-[0_26px_40px_rgba(0,0,0,0.65)]",
    delay: "0.85s",
  },
];

// Cintas rojas pegadas en las esquinas de las piezas.
const TAPES = [
  "left-[-2%] top-[2%] -rotate-[38deg]",
  "left-[34%] top-[35.5%] rotate-[8deg]",
  "left-[56%] bottom-[28%] -rotate-[24deg]",
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
    <section className="relative overflow-hidden bg-black px-6 py-16 text-white sm:px-10">
      {/* Banda ancha con los ojos, muy tenue, que cierra la sección por abajo (solo escritorio). */}
      <img
        src={eyes}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="shop-piece pointer-events-none absolute inset-x-0 bottom-0 hidden h-64 w-full object-cover object-[50%_14%] opacity-20 mix-blend-screen lg:block"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, transparent, #000 22%, #000 40%, transparent)",
          maskImage:
            "linear-gradient(to top, transparent, #000 22%, #000 40%, transparent)",
          "--piece-delay": "0.2s",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[5fr_7fr]">
        {/* Collage de la izquierda: ocupa todo el alto de la sección. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative hidden min-h-[58rem] lg:block"
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
          {TAPES.map((position) => (
            <span
              key={position}
              className={`shop-piece absolute z-10 h-6 w-20 bg-accent/90 shadow-md ${position}`}
              style={{ "--piece-delay": "0.9s" }}
            />
          ))}
        </div>

        <div>
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
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8">
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
              className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8"
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
      </div>
    </section>
  );
}

export default ShopTabs;
