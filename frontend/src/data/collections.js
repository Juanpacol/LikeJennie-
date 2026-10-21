import fallenAngelCover from "../assets/fallen-angel-cover.jpg";
import hariboCover from "../assets/haribo-cover.jpg";
import rubyCover from "../assets/ruby-cover.jpg";

// Colecciones de la tienda. No hay modelo en la DB: un producto pertenece a la colección
// si su nombre contiene `match`.
// `phrase`: frase de la colección (texto de EJEMPLO: reemplázalo por el que quieras); se muestra en la
// cabecera de su página.
// `theme`: page = fondo de la página, ink = texto, accent = botones y precio en oferta,
// onAccent = texto sobre el accent, frame (opcional) = color del marco, el footer y la barra del
// navegador cuando el de `page` no se distingue (p. ej. una colección en negro). `image` (opcional) = foto de la banda en la home, con `imageSide` ("left"|"right", por defecto right)
// `imageWidth` (px máximos de ancho) e `imagePosition` (qué parte de la foto queda visible).
export const COLLECTIONS = {
  "fallen-angel": {
    title: "Fallen Angel",
    tagline: "Nueva colección",
    description: "Hoodies, camisetas y accesorios con el flow de Ruby.",
    match: "fallen angel",
    phrase: "Cae con estilo.",
    image: fallenAngelCover,
    imageSide: "right",
    imageWidth: 680,
    imagePosition: "50% 0%",
    theme: {
      page: "#D9C8E0",
      ink: "#24102F",
      accent: "#24102F",
      onAccent: "#FFFFFF",
    },
  },
  haribo: {
    title: "JENNIE x Haribo",
    tagline: "Colaboración",
    description:
      "Camisetas, buzos, gorras y llaveros con la dulzura de Haribo.",
    match: "haribo",
    phrase: "Dulce, pero con carácter.",
    image: hariboCover,
    imageSide: "left",
    imageWidth: 560,
    imagePosition: "50% 15%",
    theme: {
      page: "#FFD500",
      ink: "#2A0008",
      accent: "#D6001C",
      onAccent: "#FFFFFF",
    },
  },
  ruby: {
    title: "JENNIE x Ruby",
    tagline: "El álbum",
    description:
      "Camisetas, buzos y música del álbum Ruby, en negro y rojo sangre.",
    match: "ruby",
    phrase: "Rojo hasta el fondo.",
    image: rubyCover,
    imageSide: "right",
    imageWidth: 480,
    imagePosition: "50% 42%",
    divider: true,
    theme: {
      page: "#000000",
      ink: "#F5EDED",
      accent: "#D6001C",
      onAccent: "#FFFFFF",
      frame: "#D6001C",
    },
  },
};
