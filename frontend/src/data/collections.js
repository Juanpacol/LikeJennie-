// Colecciones de la tienda. No hay modelo en la DB: un producto pertenece a la colección
// si su nombre contiene `match`.
// `theme`: page = fondo de la página, ink = texto, accent = botones y precio en oferta,
// onAccent = texto sobre el accent.
export const COLLECTIONS = {
  "fallen-angel": {
    title: "Fallen Angel",
    tagline: "Nueva colección",
    description: "Hoodies, camisetas y accesorios con el flow de Ruby.",
    match: "fallen angel",
    theme: { page: "#D9C8E0", ink: "#24102F", accent: "#24102F", onAccent: "#FFFFFF" },
  },
  haribo: {
    title: "JENNIE x Haribo",
    tagline: "Colaboración",
    description: "Camisetas, buzos, gorras y llaveros con la dulzura de Haribo.",
    match: "haribo",
    theme: { page: "#D6001C", ink: "#FFFFFF", accent: "#FFD500", onAccent: "#000000" },
  },
};
