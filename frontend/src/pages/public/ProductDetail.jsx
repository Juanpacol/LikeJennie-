import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.variants[0]?.size ?? null);
        setSelectedColor(data.variants[0]?.color ?? null);
        setImageIndex(0);
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
      <p className="mx-auto max-w-6xl px-6 py-10 text-white/60">Cargando...</p>
    );
  if (error)
    return <p className="mx-auto max-w-6xl px-6 py-10 text-accent">{error}</p>;
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

  const images = product.images;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 text-white">
      <Link
        to="/catalogo"
        className="hover-underline font-display text-xs uppercase tracking-widest text-white/60"
      >
        ← Volver a la tienda
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-800">
            <img
              src={images[imageIndex]?.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((image, index) => (
                <button
                  key={image.id ?? image.url}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  className={`h-20 w-16 overflow-hidden rounded bg-neutral-800 transition ${
                    imageIndex === index
                      ? "ring-2 ring-white"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className="font-display text-xs uppercase tracking-widest text-white/60">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl">{product.name}</h1>

          <p className="mt-3 text-lg">
            {hasSale ? (
              <>
                <span className="mr-2 text-white/50 line-through">
                  {formatPrice(product.basePrice)}
                </span>
                <span className="font-semibold text-accent">
                  {formatPrice(product.salePrice)}
                </span>
              </>
            ) : (
              <span>{formatPrice(product.basePrice)}</span>
            )}
          </p>

          <p className="mt-4 text-white/70">{product.description}</p>

          <VariantSelector
            sizes={sizes}
            colors={colors}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSelectSize={setSelectedSize}
            onSelectColor={setSelectedColor}
          />

          <div className="mt-6 text-sm">
            {!selectedVariant && (
              <p className="text-white/60">
                Selecciona una talla y un color disponibles.
              </p>
            )}
            {selectedVariant?.isOutOfStock && (
              <p className="font-medium text-accent">
                Agotado en esta combinación.
              </p>
            )}
            {selectedVariant?.isLowStock && (
              <p className="font-medium text-amber-400">
                ¡Últimas {selectedVariant.stock} unidades!
              </p>
            )}
            {selectedVariant &&
              !selectedVariant.isOutOfStock &&
              !selectedVariant.isLowStock && (
                <p className="text-white/60">Disponible.</p>
              )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                className="h-9 w-9 rounded-full border border-white/30 transition hover:border-white"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
                className="h-9 w-9 rounded-full border border-white/30 transition hover:border-white"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="btn-sweep flex-1 bg-white py-3 font-display text-xs uppercase tracking-widest text-black [--sweep:rgb(0_0_0/0.12)] disabled:opacity-40"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
