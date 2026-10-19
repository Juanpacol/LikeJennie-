import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import VariantSelector from "../../components/product/VariantSelector";

function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  if (loading)
    return (
      <div className="bg-black">
        <p className="mx-auto max-w-6xl px-4 py-10 text-white/60">Cargando...</p>
      </div>
    );
  if (error)
    return (
      <div className="bg-black">
        <p className="mx-auto max-w-6xl px-4 py-10 text-accent">{error}</p>
      </div>
    );
  if (!product) return null;

  const hasSale = product.salePrice != null;
  const price = hasSale ? product.salePrice : product.basePrice;
  const canAddToCart = selectedVariant && !selectedVariant.isOutOfStock;

  function handleAddToCart() {
    addItem({
      variantId: selectedVariant.id,
      productName: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: Number(price),
      image: product.images[0]?.url,
      quantity,
    });
    setQuantity(1);
  }

  return (
    <div className="bg-black">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold text-white">{product.name}</h1>

          <p className="mt-2 text-lg">
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

          <p className="mt-4 text-white/60">{product.description}</p>

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
              <p className="text-sm text-white/50">Seleccioná talla y color disponibles.</p>
            )}
            {selectedVariant?.isOutOfStock && (
              <p className="text-sm font-medium text-accent">Agotado en esta combinación.</p>
            )}
            {selectedVariant?.isLowStock && (
              <p className="text-sm font-medium text-amber-500">
                ¡Últimas {selectedVariant.stock} unidades!
              </p>
            )}
            {selectedVariant && !selectedVariant.isOutOfStock && !selectedVariant.isLowStock && (
              <p className="text-sm text-white/50">Disponible.</p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-8 w-8 rounded border border-white/30 text-sm text-white"
              >
                −
              </button>
              <span className="w-6 text-center text-sm text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-8 w-8 rounded border border-white/30 text-sm text-white"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="flex-1 rounded-full bg-accent py-3 font-display text-sm text-white disabled:opacity-40"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
