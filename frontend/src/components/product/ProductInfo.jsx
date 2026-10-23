import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalog } from "../../services/product.service";
import ProductCard from "./ProductCard";

// Textos de EJEMPLO de los acordeones: reemplázalos por los reales de la tienda.
const DETAILS = [
  {
    title: "Detalles",
    body: "Algodón pesado, corte relajado y estampado de la colección. Lavado previo para evitar que encoja.",
  },
  {
    title: "Envío",
    body: "Envío a todo el país en 3 a 6 días hábiles. Gratis en compras superiores a $300.000.",
  },
  {
    title: "Cuidado",
    body: "Lavar del revés en agua fría, no usar secadora y planchar a baja temperatura.",
  },
];

// Zona clara bajo la compra del producto, con los colores de su colección: borde superior diagonal
// (como el del panel de compra), nombre de la colección como marca de agua, descripción con acordeones,
// y otros productos de la misma colección.
function ProductInfo({ product, collection }) {
  const { panel, theme } = collection;
  const [related, setRelated] = useState([]);

  useEffect(() => {
    getCatalog()
      .then((all) =>
        setRelated(
          all
            .filter(
              (p) =>
                p.id !== product.id &&
                p.name.toLowerCase().includes(collection.match),
            )
            .slice(0, 4),
        ),
      )
      .catch(() => setRelated([]));
  }, [product.id, collection.match]);

  return (
    // El fondo de detrás es el color de la colección, que asoma por encima del borde diagonal.
    <div style={{ backgroundColor: panel.stage }}>
      <div
        className="info-edge relative overflow-hidden px-6 pb-16 pt-20 lg:pt-28"
        style={{
          backgroundColor: panel.detail.bg,
          color: panel.detail.ink,
          "--card-ink": panel.detail.ink,
          "--card-accent": theme.accent,
        }}
      >
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 left-4 select-none whitespace-nowrap font-condensed text-[min(28vw,22rem)] font-semibold uppercase leading-none opacity-[0.07]"
        >
          {collection.title}
        </p>

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-fade-up">
            <Link
              to="/catalogo"
              className="hover-underline font-mono text-[11px] uppercase tracking-[0.25em]"
            >
              ← Volver a la tienda
            </Link>
            <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
              Descripción
            </h2>
            <p className="mt-4 max-w-xl font-condensed text-2xl font-light leading-snug sm:text-3xl">
              {product.description}
            </p>
          </div>

          <div
            className="animate-fade-up self-end"
            style={{ animationDelay: "120ms" }}
          >
            {DETAILS.map((item) => (
              <details
                key={item.title}
                className="info-item border-t border-current py-4 last:border-b"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em]">
                  {item.title}
                  <span aria-hidden="true" className="info-plus text-lg">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80">
                  {item.body}
                </p>
              </details>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="relative mx-auto mt-20 max-w-6xl">
            <h2 className="font-condensed text-3xl font-light uppercase sm:text-4xl">
              Más de {collection.title}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
