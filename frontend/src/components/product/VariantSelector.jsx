// Selector de talla y color para la tarjeta de compra (fondo claro). Las tallas sin existencias
// (para el color elegido) salen tachadas y deshabilitadas, como en las tiendas de moda.
function VariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  isSizeAvailable,
}) {
  return (
    <div>
      {colors.length > 1 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(color)}
                aria-pressed={selectedColor === color}
                className={`border px-3 py-1.5 font-display text-xs uppercase tracking-widest transition ${
                  selectedColor === color
                    ? "border-accent bg-accent text-white"
                    : "border-white/30 hover:border-white"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="font-display text-xs uppercase tracking-widest">Tallas</p>
      <div className="mt-3 flex flex-wrap gap-x-1 gap-y-2">
        {sizes.map((size) => {
          const available = isSizeAvailable(size);
          const selected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              disabled={!available}
              onClick={() => onSelectSize(size)}
              aria-pressed={selected}
              className={`min-w-11 border-b-2 px-3 py-1.5 font-display text-sm uppercase transition ${
                selected
                  ? "border-accent font-semibold"
                  : "border-transparent hover:border-white/40"
              } ${available ? "" : "cursor-not-allowed text-white/25 line-through"}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
