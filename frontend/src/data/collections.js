// Colecciones de la tienda. No hay modelo en la DB: un producto pertenece a la colección
// si su nombre contiene `match`. `theme` elige los colores de su banda en la home.
export const COLLECTIONS = {
  "fallen-angel": {
    title: "Fallen Angel",
    tagline: "Nueva colección",
    description: "Hoodies, camisetas y accesorios con el flow de Ruby.",
    match: "fallen angel",
    theme: "lilac",
  },
  haribo: {
    title: "JENNIE x Haribo",
    tagline: "Colaboración",
    description: "Camisetas, buzos, gorras y llaveros con la dulzura de Haribo.",
    match: "haribo",
    theme: "ruby",
  },
};
