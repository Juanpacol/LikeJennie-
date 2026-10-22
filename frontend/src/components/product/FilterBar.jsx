const TAB_CLASS =
  "shrink-0 border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] transition";

// Pestañas de categoría en monoespaciada, con numeración y el total de piezas a la derecha,
// bajo una línea fina (idea del listado de offform.net).
function FilterBar({ categories, selected, onSelect, total }) {
  function tabClass(active) {
    return `${TAB_CLASS} ${
      active
        ? "border-accent text-white"
        : "border-transparent text-white/50 hover:text-white"
    }`;
  }

  return (
    <div className="mt-12 flex items-end justify-between gap-6 border-t border-white/20 pt-5">
      <div className="no-scrollbar flex gap-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={tabClass(selected === null)}
        >
          <span className="mr-2 text-white/40">00</span>Todo
        </button>
        {categories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.slug)}
            className={tabClass(selected === category.slug)}
          >
            <span className="mr-2 text-white/40">0{index + 1}</span>
            {category.name}
          </button>
        ))}
      </div>
      {total != null && (
        <p className="hidden shrink-0 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 sm:block">
          {total} {total === 1 ? "pieza" : "piezas"}
        </p>
      )}
    </div>
  );
}

export default FilterBar;
