import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

function ProductCard({ product }) {
  const isOutOfStock = product.variants.every((variant) => variant.isOutOfStock);
  const hasSale = product.salePrice != null;

  return (
    <Link to={`/productos/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {isOutOfStock && (
          <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs text-white">
            Agotado
          </span>
        )}
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm">
        {hasSale ? (
          <>
            <span className="mr-2 text-gray-400 line-through">
              {formatPrice(product.basePrice)}
            </span>
            <span className="font-semibold text-red-600">
              {formatPrice(product.salePrice)}
            </span>
          </>
        ) : (
          <span className="text-gray-900">{formatPrice(product.basePrice)}</span>
        )}
      </p>
    </Link>
  );
}

export default ProductCard;
