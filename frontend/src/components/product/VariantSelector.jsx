function VariantSelector({ sizes, colors, selectedSize, selectedColor, onSelectSize, onSelectColor }) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700">Talla</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700">Color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                selectedColor === color
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-700"
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
