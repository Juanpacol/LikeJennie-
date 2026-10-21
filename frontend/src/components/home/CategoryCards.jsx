import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import { getCatalog } from "../../services/product.service";

// Texto corto de cada categoría; las que no estén aquí salen sin descripción.
const BLURBS = {
  ropa: "Camisetas, tanks y básicos",
  abrigos: "Hoodies, buzos y pantalones",
  accesorios: "Gorras, llaveros y objetos",
  musica: "CDs y ediciones limitadas",
};

// Sección numerada de categorías (#1, #2...): cada tarjeta usa la foto de un producto real de la
// categoría en duotono (blanco y negro mezclado con el rojo de la marca).
function CategoryCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([getCategories(), getCatalog()])
      .then(([categories, products]) =>
        setCards(
          categories.map((category) => {
            const inCategory = products.filter(
              (p) => p.category?.slug === category.slug,
            );
            return {
              ...category,
              count: inCategory.length,
              image: inCategory.find((p) => p.images[0])?.images[0].url,
            };
          }),
        ),
      )
      .catch(() => {});
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-xs uppercase tracking-widest text-white/60">
          Explora
        </p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl">
          Elige tu mundo
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {cards.map((card, index) => (
            <Link
              key={card.id}
              to={`/catalogo?categoria=${card.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-accent"
            >
              {card.image && (
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover mix-blend-multiply grayscale transition-transform duration-500 ease-out group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              <p className="absolute left-4 top-4 font-display text-xs uppercase tracking-widest">
                #{index + 1} {card.name}
              </p>

              <div className="absolute inset-x-4 bottom-4">
                <h3 className="group-hover-underline inline-block font-display text-2xl sm:text-3xl">
                  {card.name}
                </h3>
                <p className="mt-2 font-display text-xs uppercase tracking-widest opacity-80">
                  {BLURBS[card.slug] ?? ""}
                </p>
                <p className="mt-1 font-display text-xs uppercase tracking-widest opacity-60">
                  {card.count} productos
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryCards;
