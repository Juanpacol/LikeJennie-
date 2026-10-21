import fallenAngelCover from "../assets/fallen-angel-cover.jpg";
import hariboCover from "../assets/haribo-cover.jpg";

// Colecciones de la tienda. No hay modelo en la DB: un producto pertenece a la colección
// si su nombre contiene `match`.
// `theme`: page = fondo de la página, ink = texto, accent = botones y precio en oferta,
// onAccent = texto sobre el accent. `image` (opcional) = foto de la banda en la home, con `imageSide` ("left"|"right", por defecto right)
// y `imageAspect` (proporción CSS, por defecto 1/1) para mostrarla entera.
export const COLLECTIONS = {
  "fallen-angel": {
    title: "Fallen Angel",
    tagline: "Nueva colección",
    description: "Hoodies, camisetas y accesorios con el flow de Ruby.",
    match: "fallen angel",
    image: fallenAngelCover,
    imageSide: "right",
    imageAspect: "1 / 1",
    theme: { page: "#D9C8E0", ink: "#24102F", accent: "#24102F", onAccent: "#FFFFFF" },
  },
  haribo: {
    title: "JENNIE x Haribo",
    tagline: "Colaboración",
    description: "Camisetas, buzos, gorras y llaveros con la dulzura de Haribo.",
    match: "haribo",
    image: hariboCover,
    imageSide: "left",
    imageAspect: "3 / 4",
    theme: { page: "#FFD500", ink: "#2A0008", accent: "#D6001C", onAccent: "#FFFFFF" },
  },
};
