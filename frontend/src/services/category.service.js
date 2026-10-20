import { apiRequest } from "./api";

// Orden en que se muestran las categorías en el menú, el footer y los filtros.
// La API las devuelve sin orden fijo; las que no estén aquí quedan al final.
const CATEGORY_ORDER = ["ropa", "abrigos", "accesorios", "musica"];

function orderIndex(category) {
  const index = CATEGORY_ORDER.indexOf(category.slug);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export async function getCategories() {
  const categories = await apiRequest("/categories");
  return [...categories].sort((a, b) => orderIndex(a) - orderIndex(b));
}
