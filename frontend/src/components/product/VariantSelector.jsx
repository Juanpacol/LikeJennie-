function VariantSelector({ sizes, colors, selectedSize, selectedColor, onSelectSize, onSelectColor }) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <p className="font-display text-sm font-medium text-white/70">Talla</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`rounded-full border px-4 py-1.5 font-display text-sm transition ${
                selectedSize === size
                  ? "border-accent bg-accent text-white"
                  : "border-white/30 text-white/70"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-sm font-medium text-white/70">Color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              className={`rounded-full border px-4 py-1.5 font-display text-sm transition ${
                selectedColor === color
                  ? "border-accent bg-accent text-white"
                  : "border-white/30 text-white/70"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VariantSelector;
