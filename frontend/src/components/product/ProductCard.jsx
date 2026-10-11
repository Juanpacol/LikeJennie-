import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

function ProductCard({ product }) {
  const isOutOfStock = product.variants.every((variant) => variant.isOutOfStock);
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
      <h3 className="mt-3 font-display text-sm font-medium text-white">{product.name}</h3>
      <p className="mt-1 text-sm">
        {hasSale ? (
          <>
            <span className="mr-2 text-white/40 line-through">
              {formatPrice(product.basePrice)}
            </span>
            <span className="font-semibold text-accent">{formatPrice(product.salePrice)}</span>
          </>
        ) : (
          <span className="text-white/80">{formatPrice(product.basePrice)}</span>
        )}
      </p>
    </Link>
  );
}

export default ProductCard;
