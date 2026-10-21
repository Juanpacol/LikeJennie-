const OPTION_BASE =
  "rounded-full border px-4 py-1.5 font-display text-sm transition";
const OPTION_SELECTED = "border-white bg-white text-black";
const OPTION_IDLE = "border-white/30 text-white/80 hover:border-white";

function OptionGroup({ label, options, selected, onSelect, className = "" }) {
  return (
    <div>
      <p className="font-display text-xs uppercase tracking-widest text-white/60">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            aria-pressed={selected === option}
            className={`${OPTION_BASE} ${className} ${selected === option ? OPTION_SELECTED : OPTION_IDLE}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function VariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
}) {
  return (
    <div className="mt-6 space-y-5">
      <OptionGroup
        label="Talla"
        options={sizes}
        selected={selectedSize}
        onSelect={onSelectSize}
        className="uppercase"
      />
      <OptionGroup
        label="Color"
        options={colors}
        selected={selectedColor}
        onSelect={onSelectColor}
      />
    </div>
  );
}

export default VariantSelector;
