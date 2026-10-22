import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const COLUMNS = 4;
const STAGGER_MS = 60;

// `index` posiciona la tarjeta en la grilla para escalonar su aparición por columna.
function ProductCard({ product, index = 0 }) {
  const isOutOfStock = product.variants.every(
    (variant) => variant.isOutOfStock,
  );
  const hasSale = product.salePrice != null;
  const [first, second] = product.images;
  const discount = hasSale
    ? Math.round(
        (1 - Number(product.salePrice) / Number(product.basePrice)) * 100,
      )
    : 0;

  // Aparece (fundido y subida) la primera vez que entra en pantalla.
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(
    () => !("IntersectionObserver" in window),
  );
  useEffect(() => {
    const element = wrapperRef.current;
    if (visible || !element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  // La foto aparece en fundido cuando termina de cargar; mientras, se ve un bloque que respira.
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`reveal ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${(index % COLUMNS) * STAGGER_MS}ms` }}
    >
      <Link
        to={`/productos/${product.slug}`}
        className="group block transition-transform duration-300 ease-out hover:-translate-y-1"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-neutral-800" />
          )}

          <img
            ref={imageRef}
            src={first?.url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Segunda foto: se cruza en fundido sobre la primera al pasar el mouse. */}
          {second && (
            <img
              src={second.url}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
            />
          )}

          {isOutOfStock && (
            <span className="absolute left-3 top-3 border border-white/40 bg-black px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              Agotado
            </span>
          )}

          {hasSale && !isOutOfStock && (
            <span className="absolute left-3 top-3 bg-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              -{discount}%
            </span>
          )}
          <span className="absolute right-3 top-3 font-mono text-[10px] tracking-[0.2em] text-white mix-blend-difference">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {/* Subrayado por línea (background-size): se ajusta al texto aunque ocupe dos líneas. */}
          <h3
            className="inline bg-[length:0%_1px] bg-left-bottom bg-no-repeat font-display text-[13px] uppercase leading-snug tracking-wide text-[color:var(--card-ink,#fff)] transition-[background-size] duration-300 [box-decoration-break:clone] group-hover:bg-[length:100%_1px]"
            style={{
              backgroundImage: "linear-gradient(currentColor, currentColor)",
            }}
          >
            {product.name}
          </h3>
          <p className="shrink-0 font-mono text-xs sm:text-right">
            {hasSale ? (
              <>
                <span className="block font-semibold text-[color:var(--card-accent,#D6001C)]">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="block text-[color:var(--card-ink,#fff)] line-through opacity-40">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-[color:var(--card-ink,#fff)] opacity-80">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
