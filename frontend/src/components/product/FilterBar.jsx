function FilterBar({ categories, selected, onSelect }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-1.5 text-sm transition ${
          selected === null ? "border-black bg-black text-white" : "border-gray-300 text-gray-700"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.slug)}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            selected === category.slug
              ? "border-black bg-black text-white"
              : "border-gray-300 text-gray-700"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
