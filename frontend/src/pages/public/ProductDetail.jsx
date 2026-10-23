import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import { collectionOfProduct } from "../../data/collections";
import ImageLightbox from "../../components/product/ImageLightbox";
import { useHeaderTheme } from "../../utils/useHeaderTheme";
import BackLink from "../../components/product/BackLink";
import ProductInfo from "../../components/product/ProductInfo";
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
  const [lightboxIndex, setLightboxIndex] = useState(null);
  // Foto activa: en escritorio la elige el mouse al recorrer la foto; en móvil, el deslizamiento.
  const [activeIndex, setActiveIndex] = useState(0);
  const stripRef = useRef(null);
  // El header y el fondo de la página toman el color de la colección mientras se ve el producto.
  useHeaderTheme(
    product ? collectionOfProduct(product.name).panel.stage : null,
  );

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

  // Escritorio: el mouse recorre la foto de izquierda a derecha y muestra cada imagen completa
  // (con dos fotos, la mitad izquierda muestra la primera y la derecha la segunda). Al salir, vuelve a la primera.
  function handleStageMove(event) {
    if (
      photoCount < 2 ||
      !window.matchMedia("(hover: hover) and (min-width: 1024px)").matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    setActiveIndex(
      Math.min(photoCount - 1, Math.max(0, Math.floor(ratio * photoCount))),
    );
  }

  function handleStageLeave() {
    if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches)
      setActiveIndex(0);
  }

  // Móvil: una foto por pantalla; el índice sigue al deslizamiento.
  function handleStripScroll(event) {
    const strip = event.currentTarget;
    if (strip.scrollWidth > strip.clientWidth) {
      setActiveIndex(Math.round(strip.scrollLeft / strip.clientWidth));
    }
  }

  function goToPhoto(index) {
    setActiveIndex(index);
    const strip = stripRef.current;
    if (strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: index * strip.clientWidth, behavior: "smooth" });
    }
  }

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
  // Colores y dibujo de la colección a la que pertenece el producto.
  const collection = collectionOfProduct(product.name);
  const { panel, art } = collection;
  // Dibujo del panel: en tinta oscura sobre el color; el del fondo oscuro, claro con screen.
  const artMask =
    "linear-gradient(to bottom, transparent, #000 30%), linear-gradient(to right, transparent, #000 35%)";
  const stageMask =
    "linear-gradient(to right, #000 15%, transparent 85%), linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)";

  return (
    <section className="text-white">
      {/* Galería a pantalla completa con la columna de compra a la derecha. */}
      <div
        className="lg:grid lg:h-[calc(100vh-88px)] lg:min-h-[620px] lg:grid-cols-[1fr_29rem]"
        style={{ backgroundColor: panel.stage }}
      >
        <div
          className="relative isolate h-[68vh] overflow-hidden lg:h-full"
          style={{ backgroundColor: panel.stage }}
          onMouseMove={handleStageMove}
          onMouseLeave={handleStageLeave}
        >
          {/* Volver a la colección del producto (o a la tienda si no tiene). */}
          <BackLink
            to={
              collection.slug ? `/colecciones/${collection.slug}` : "/catalogo"
            }
            label={collection.slug ? collection.title : "Tienda"}
          />

          {/* Foco de luz con el tono de la colección detrás de la prenda: separa del fondo las prendas
              negras, rojas o blancas. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(ellipse 62% 72% at 50% 52%, color-mix(in srgb, ${panel.detail.bg} 38%, transparent), transparent 74%)`,
            }}
          />

          {/* Dibujo de la colección, en claro y muy tenue, detrás de la prenda. */}
          <img
            src={art.image}
            alt=""
            aria-hidden="true"
            className="katana-bg pointer-events-none absolute -left-10 bottom-0 -z-10 hidden h-[105%] w-auto max-w-none opacity-25 mix-blend-screen lg:block"
            style={{
              WebkitMaskImage: stageMask,
              WebkitMaskComposite: "source-in",
              maskImage: stageMask,
              maskComposite: "intersect",
            }}
          />

          {/* Móvil: una foto por pantalla, se desliza. Escritorio: fotos apiladas con fundido. */}
          <div
            ref={stripRef}
            onScroll={handleStripScroll}
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto lg:block lg:overflow-hidden"
          >
            {images.map((image, index) => (
              <button
                key={image.id ?? image.url}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Ver foto ${index + 1} a pantalla completa`}
                className={`h-full w-full shrink-0 cursor-zoom-in snap-center p-6 transition-opacity duration-500 lg:absolute lg:inset-0 lg:p-10 ${
                  index === activeIndex
                    ? "lg:opacity-100"
                    : "lg:pointer-events-none lg:opacity-0"
                }`}
              >
                <img
                  src={image.url}
                  alt={index === 0 ? product.name : ""}
                  className="h-full w-full object-contain brightness-[1.3] contrast-[1.05]"
                />
              </button>
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 right-6 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id ?? image.url}
                  type="button"
                  onClick={() => goToPhoto(index)}
                  aria-label={`Foto ${index + 1} de ${images.length}`}
                  aria-current={index === activeIndex}
                  className={`h-2 transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-accent"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}

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

        {/* Panel de compra: rojo, con el mismo borde diagonal y filo blanco que el carrito. Cada bloque
            entra en cascada (la key reinicia la animación al cambiar de producto). */}
        <aside
          key={product.id}
          style={{
            backgroundColor: panel.bg,
            color: panel.text,
            "--panel-text": panel.text,
            "--panel-button": panel.button,
            "--panel-on-button": panel.onButton,
          }}
          className="product-panel relative isolate overflow-hidden px-6 py-8 lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto lg:py-10 lg:pl-16 lg:pr-10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full lg:block"
          >
            <line
              x1="5.4"
              y1="0"
              x2="0.4"
              y2="100"
              stroke={panel.text}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              opacity="0.85"
            />
          </svg>
          {/* Dibujo de la colección: se invierte y se mezcla en multiplicación, así el negro de la foto desaparece
              sobre el color y queda la figura en tinta oscura. Se desvanece por la izquierda y por arriba. */}
          <img
            src={art.image}
            alt=""
            aria-hidden="true"
            className="katana-bg pointer-events-none absolute -bottom-4 -right-16 -z-10 h-[96%] opacity-55 w-auto max-w-none mix-blend-multiply [filter:invert(1)]"
            style={{
              WebkitMaskImage: artMask,
              WebkitMaskComposite: "source-in",
              maskImage: artMask,
              maskComposite: "intersect",
            }}
          />

          <div
            className="animate-fade-up flex items-start justify-between gap-3"
            style={{ animationDelay: "120ms" }}
          >
            {product.category && (
              <p className="border border-current px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em]">
                {product.category.name}
              </p>
            )}
            {hasSale && (
              <p className="bg-[var(--panel-button)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--panel-on-button)]">
                -{discount}%
              </p>
            )}
          </div>

          <div
            className="animate-fade-up mt-5 flex items-start justify-between gap-4"
            style={{ animationDelay: "200ms" }}
          >
            <h1 className="font-condensed text-4xl font-light uppercase leading-[0.95] xl:text-5xl">
              {product.name}
            </h1>
            <p className="shrink-0 text-right">
              {hasSale ? (
                <>
                  <span className="block font-condensed text-3xl leading-none">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] line-through opacity-70">
                    {formatPrice(product.basePrice)}
                  </span>
                </>
              ) : (
                <span className="font-condensed text-3xl leading-none">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </p>
          </div>

          <div
            className="animate-fade-up mt-6 border-t border-current pt-6"
            style={{ animationDelay: "280ms" }}
          >
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

          <p
            className="animate-fade-up mt-4 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ animationDelay: "340ms" }}
          >
            {!selectedVariant && "Selecciona una talla disponible."}
            {selectedVariant?.isOutOfStock && "Agotado en esta combinación."}
            {selectedVariant?.isLowStock &&
              `¡Últimas ${selectedVariant.stock} unidades!`}
            {selectedVariant &&
              !selectedVariant.isOutOfStock &&
              !selectedVariant.isLowStock && (
                <span className="opacity-80">Disponible</span>
              )}
          </p>

          <div
            className="animate-fade-up mt-4 flex items-center gap-3"
            style={{ animationDelay: "400ms" }}
          >
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Disminuir cantidad"
              className="h-10 w-10 border border-current transition hover:bg-[var(--panel-button)] hover:text-[var(--panel-on-button)]"
            >
              −
            </button>
            <span
              key={quantity}
              className="animate-fade-up w-6 text-center font-mono text-sm"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar cantidad"
              className="h-10 w-10 border border-current transition hover:bg-[var(--panel-button)] hover:text-[var(--panel-on-button)]"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="btn-sweep animate-fade-up mt-5 w-full bg-[var(--panel-button)] py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--panel-on-button)] [--sweep:rgb(255_255_255/0.2)] disabled:opacity-40"
            style={{ animationDelay: "460ms" }}
          >
            Añadir al carrito
          </button>
        </aside>
      </div>

      <ProductInfo product={product} collection={collection} />

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          alt={product.name}
          collection={collection}
        />
      )}
    </section>
  );
}

export default ProductDetail;
