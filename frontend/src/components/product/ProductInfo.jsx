import { useEffect, useState } from "react";
import { getCatalog } from "../../services/product.service";
import ProductCard from "./ProductCard";
import { useLanguage } from "../../context/LanguageContext";

// Acordeones de la ficha: claves de i18n (los textos son de EJEMPLO; se editan en i18n/en.js y es.js).
const DETAILS = [
  { title: "product.detailsTitle", body: "product.detailsBody" },
  { title: "product.shippingTitle", body: "product.shippingBody" },
  { title: "product.careTitle", body: "product.careBody" },
];

// Zona clara bajo la compra del producto, con los colores de su colección: borde superior diagonal
// (como el del panel de compra), nombre de la colección como marca de agua, descripción con acordeones,
// y otros productos de la misma colección.
function ProductInfo({ product, collection }) {
  const { t } = useLanguage();
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
          className="pointer-events-none absolute -top-2 left-4 max-w-full select-none overflow-hidden whitespace-nowrap font-condensed text-[min(22vw,22rem)] font-semibold uppercase leading-none opacity-[0.07]"
        >
          {collection.title}
        </p>

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-fade-up">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
              {t("product.description")}
            </h2>
            <p className="mt-4 max-w-xl font-display text-base leading-relaxed sm:font-condensed sm:text-3xl sm:font-light sm:leading-snug">
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
                  {t(item.title)}
                  <span aria-hidden="true" className="info-plus text-lg">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80">
                  {t(item.body)}
                </p>
              </details>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="relative mx-auto mt-20 max-w-6xl">
            <h2 className="font-condensed text-3xl font-light uppercase sm:text-4xl">
              {t("product.moreFrom", { title: collection.title })}
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
