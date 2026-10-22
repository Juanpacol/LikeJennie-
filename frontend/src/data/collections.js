import fallenAngelCover from "../assets/fallen-angel-cover.jpg";
import fallenAngelFooter from "../assets/fallen-angel-footer.jpg";
import fallenAngelField from "../assets/fallen-angel-field.jpg";
import hariboFooterA from "../assets/haribo-footer-a.jpg";
import hariboFooterB from "../assets/haribo-footer-b.jpg";
import hariboCover from "../assets/haribo-cover.jpg";
import rubyFooter from "../assets/ruby-footer.jpg";
import rubyBanner from "../assets/ruby-banner.jpg";
import rubyCover from "../assets/ruby-cover.jpg";

// Colecciones de la tienda. No hay modelo en la DB: un producto pertenece a la colección
// si su nombre contiene `match`.
// `phrase`: frase de la colección (texto de EJEMPLO: reemplázalo por el que quieras); se muestra en la
// cabecera de su página.
// `theme`: page = fondo de la página, ink = texto, accent = botones y precio en oferta,
// onAccent = texto sobre el accent, frame (opcional) = color del marco, el footer y la barra del
// navegador cuando el de `page` no se distingue (p. ej. una colección en negro). `image` (opcional) = foto de la banda en la home, con `imageSide` ("left"|"right", por defecto right)
// `footer`: `images` (opcional, dos fotos: izquierda y derecha) en lugar de `image`; paleta (bg, ink, muted), frase (tagline) y foto (image; si falta se usa `image`) del footer
// de su página.
// `secondImage` (opcional) = segunda foto, más pequeña, que se muestra arriba a la izquierda de la cabecera.
// `bannerImage` (opcional) = foto de la cabecera de su página; si falta se usa `image`, con `bannerPosition`
// (qué parte queda visible). `imageWidth` (px máximos de ancho) e `imagePosition` (qué parte de la foto queda visible).
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
    secondImage: fallenAngelField,
    footer: {
      image: fallenAngelFooter,
      bg: "#24102F",
      ink: "#E9DDF0",
      muted: "#9C86A8",
      tagline: "Cae con estilo",
      position: "50% 45%",
    },
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
    footer: {
      images: [
        { src: hariboFooterA, position: "50% 30%" },
        { src: hariboFooterB, position: "40% 40%" },
      ],
      bg: "#2A0008",
      ink: "#FFD500",
      muted: "#B8902A",
      tagline: "Dulce, pero con carácter",
    },
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
    bannerImage: rubyBanner,
    bannerPosition: "50% 35%",
    imageSide: "right",
    imageWidth: 480,
    imagePosition: "50% 42%",
    divider: true,
    footer: {
      image: rubyFooter,
      position: "50% 25%",
      bg: "#0B0B0B",
      ink: "#F5EDED",
      muted: "#8A6F6F",
      tagline: "Rojo hasta el fondo",
    },
    theme: {
      page: "#000000",
      ink: "#F5EDED",
      accent: "#D6001C",
      onAccent: "#FFFFFF",
      frame: "#D6001C",
    },
  },
};
