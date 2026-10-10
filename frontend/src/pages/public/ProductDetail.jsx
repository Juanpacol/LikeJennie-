import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";
import VariantSelector from "../../components/product/VariantSelector";

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.variants[0]?.size ?? null);
        setSelectedColor(data.variants[0]?.color ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const sizes = useMemo(
    () => [...new Set(product?.variants.map((v) => v.size))],
    [product],
  );
  const colors = useMemo(
    () => [...new Set(product?.variants.map((v) => v.color))],
    [product],
  );

  const selectedVariant = product?.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  if (loading) return <p className="mx-auto max-w-6xl px-4 py-10 text-gray-500">Cargando...</p>;
  if (error) return <p className="mx-auto max-w-6xl px-4 py-10 text-red-600">{error}</p>;
  if (!product) return null;

  const hasSale = product.salePrice != null;

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2">
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>

        <p className="mt-2 text-lg">
          {hasSale ? (
            <>
              <span className="mr-2 text-gray-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
              <span className="font-semibold text-red-600">{formatPrice(product.salePrice)}</span>
            </>
          ) : (
            <span>{formatPrice(product.basePrice)}</span>
          )}
        </p>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <VariantSelector
          sizes={sizes}
          colors={colors}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSelectSize={setSelectedSize}
          onSelectColor={setSelectedColor}
        />

        <div className="mt-6">
          {!selectedVariant && (
            <p className="text-sm text-gray-500">Seleccioná talla y color disponibles.</p>
          )}
          {selectedVariant?.isOutOfStock && (
            <p className="text-sm font-medium text-red-600">Agotado en esta combinación.</p>
          )}
          {selectedVariant?.isLowStock && (
            <p className="text-sm font-medium text-amber-600">
              ¡Últimas {selectedVariant.stock} unidades!
            </p>
          )}
          {selectedVariant && !selectedVariant.isOutOfStock && !selectedVariant.isLowStock && (
            <p className="text-sm text-gray-500">Disponible.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
