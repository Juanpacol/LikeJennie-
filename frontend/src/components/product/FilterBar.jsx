function FilterBar({ categories, selected, onSelect }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-1.5 font-display text-sm transition ${
          selected === null ? "border-accent bg-accent text-white" : "border-white/30 text-white/70"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.slug)}
          className={`rounded-full border px-4 py-1.5 font-display text-sm transition ${
            selected === category.slug
              ? "border-accent bg-accent text-white"
              : "border-white/30 text-white/70"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
