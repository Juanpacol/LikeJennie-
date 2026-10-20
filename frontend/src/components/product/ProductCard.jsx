import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

function ProductCard({ product }) {
  const isOutOfStock = product.variants.every(
    (variant) => variant.isOutOfStock,
  );
  const hasSale = product.salePrice != null;

  return (
    <Link to={`/productos/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {isOutOfStock && (
          <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs uppercase tracking-wide text-white">
            Agotado
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-sm font-medium text-[color:var(--card-ink,#fff)]">
        {product.name}
      </h3>
      <p className="mt-1 text-sm">
        {hasSale ? (
          <>
            <span className="mr-2 text-[color:var(--card-ink,#fff)] line-through opacity-50">
              {formatPrice(product.basePrice)}
            </span>
            <span className="font-semibold text-[color:var(--card-accent,#D6001C)]">
              {formatPrice(product.salePrice)}
            </span>
          </>
        ) : (
          <span className="text-[color:var(--card-ink,#fff)] opacity-80">
            {formatPrice(product.basePrice)}
          </span>
        )}
      </p>
    </Link>
  );
}

export default ProductCard;
