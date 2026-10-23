import { motion } from "motion/react";

// Selector de talla y color para el panel de compra (fondo rojo). Las tallas sin existencias
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
                className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-white/60 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="font-mono text-[11px] uppercase tracking-[0.25em]">
        Tallas
      </p>
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
              className={`relative min-w-11 px-3 py-2 font-condensed text-xl uppercase transition-colors ${
                selected ? "text-white" : "text-white/70 hover:text-white"
              } ${available ? "" : "cursor-not-allowed text-white/30 line-through"}`}
            >
              {size}
              {/* La línea negra se desliza de una talla a otra. */}
              {selected && (
                <motion.span
                  layoutId="size-underline"
                  className="absolute inset-x-2 bottom-0 h-0.5 bg-black"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
