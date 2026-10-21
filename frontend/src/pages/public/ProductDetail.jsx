import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import ImageLightbox from "../../components/product/ImageLightbox";
import VariantSelector from "../../components/product/VariantSelector";

const CAROUSEL_MS = 4000;

function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  // Carrusel automático: se detiene mientras el mouse está sobre la galería.
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const stripRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        // Arranca en la primera variante con existencias (o en la primera, si todas están agotadas).
        const first =
          data.variants.find((v) => !v.isOutOfStock) ?? data.variants[0];
        setSelectedSize(first?.size ?? null);
        setSelectedColor(first?.color ?? null);
        setLightboxIndex(null);
        setActiveIndex(0);
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

  const photoCount = product?.images.length ?? 0;

  // Avanza sola cada 4 s (si hay más de una foto, no hay un visor abierto y el usuario no pidió
  // reducir el movimiento) y centra la foto activa dentro de la tira.
  useEffect(() => {
    if (hovering || photoCount < 2 || lightboxIndex !== null) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % photoCount),
      CAROUSEL_MS,
    );
    return () => clearInterval(timer);
  }, [hovering, photoCount, lightboxIndex]);

  useEffect(() => {
    const photo = stripRef.current?.children[activeIndex];
    photo?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

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
  const discount = hasSale
    ? Math.round(
        (1 - Number(product.salePrice) / Number(product.basePrice)) * 100,
      )
    : 0;
  const isSizeAvailable = (size) =>
    product.variants.some(
      (v) => v.size === size && v.color === selectedColor && !v.isOutOfStock,
    );

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
    <section className="text-white">
      {/* Galería a pantalla completa con la columna de compra a la derecha. */}
      <div className="lg:grid lg:h-[calc(100vh-127px)] lg:min-h-[620px] lg:grid-cols-[1fr_26rem]">
        <div
          className="relative h-[68vh] overflow-hidden bg-black lg:h-full"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            ref={stripRef}
            className="no-scrollbar relative flex h-full snap-x snap-mandatory items-center gap-3 overflow-x-auto px-4"
          >
            {images.map((image, index) => (
              <button
                key={image.id ?? image.url}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Ver foto ${index + 1} a pantalla completa`}
                className={`h-[92%] shrink-0 animate-slide-in-right cursor-zoom-in snap-center overflow-hidden transition-opacity duration-500 first:ml-auto last:mr-auto ${
                  index === activeIndex ? "opacity-100" : "opacity-75"
                }`}
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <img
                  src={image.url}
                  alt={index === 0 ? product.name : ""}
                  className="h-full w-auto max-w-[88vw] object-contain brightness-[1.3] contrast-[1.05] transition-transform duration-500 ease-out hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>

          <div className="absolute bottom-5 left-5 lg:left-1/2 lg:-translate-x-1/2">
            <button
              type="button"
              onClick={() => setLightboxIndex(activeIndex)}
              aria-label="Ver a pantalla completa"
              className="flex h-11 w-11 items-center justify-center border border-white/40 bg-black/70 text-white backdrop-blur transition hover:border-accent hover:bg-accent"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tarjeta de compra: de vidrio esmerilado sobre la foto en escritorio; bajo ella en móvil. */}
        <aside className="animate-fade-up border-l border-white/10 bg-[#0d0d0d] p-6 text-white [animation-delay:350ms] lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto lg:p-10">
          <div className="flex items-start justify-between gap-3">
            {product.category && (
              <p className="border border-white/30 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-widest shadow-sm">
                {product.category.name}
              </p>
            )}
            {hasSale && (
              <p className="bg-accent px-2 py-1 font-display text-xs font-semibold text-white">
                -{discount}%
              </p>
            )}
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="font-display text-xl uppercase leading-tight">
              {product.name}
            </h1>
            <p className="shrink-0 text-right">
              {hasSale ? (
                <>
                  <span className="block bg-accent px-2 py-0.5 text-sm font-semibold text-white">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="mt-1 block text-xs text-white/50 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </p>
          </div>

          <div className="mt-5 border-t border-white/15 pt-5">
            <VariantSelector
              sizes={sizes}
              colors={colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSelectSize={setSelectedSize}
              onSelectColor={setSelectedColor}
              isSizeAvailable={isSizeAvailable}
            />
          </div>

          <p className="mt-4 text-sm">
            {!selectedVariant && "Selecciona una talla disponible."}
            {selectedVariant?.isOutOfStock && (
              <span className="font-medium text-accent">
                Agotado en esta combinación.
              </span>
            )}
            {selectedVariant?.isLowStock && (
              <span className="font-medium text-amber-400">
                ¡Últimas {selectedVariant.stock} unidades!
              </span>
            )}
            {selectedVariant &&
              !selectedVariant.isOutOfStock &&
              !selectedVariant.isLowStock && (
                <span className="text-white/60">Disponible.</span>
              )}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                className="h-9 w-9 border border-white/30 transition hover:border-black"
              >
                −
              </button>
              <span className="w-5 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
                className="h-9 w-9 border border-white/30 transition hover:border-black"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="btn-sweep mt-4 w-full bg-accent py-4 font-display text-sm uppercase tracking-widest text-white disabled:opacity-40"
          >
            Añadir al carrito
          </button>
        </aside>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          to="/catalogo"
          className="hover-underline font-display text-xs uppercase tracking-widest text-white/60"
        >
          ← Volver a la tienda
        </Link>
        <h2 className="mt-8 font-display text-xs uppercase tracking-widest text-white/60">
          Descripción
        </h2>
        <p className="mt-3 max-w-2xl text-white/70">{product.description}</p>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          alt={product.name}
        />
      )}
    </section>
  );
}

export default ProductDetail;
