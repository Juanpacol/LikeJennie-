import eyes from "../../assets/cutouts/shop-eyes.webp";
import zineA from "../../assets/cutouts/shop-zine-a.webp";
import zineB from "../../assets/cutouts/shop-zine-b.webp";
import face from "../../assets/cutouts/shop-face.webp";
import poster from "../../assets/cutouts/shop-poster.webp";
import halo from "../../assets/cutouts/shop-halo.webp";
import typa from "../../assets/cutouts/shop-typa.webp";

// Collage de la columna izquierda (solo escritorio), todo en blanco y negro de alto contraste (estilo fotocopia),
// repartido a lo largo de TODO el alto del bloque (tienda + FAQs). Las posiciones son porcentajes de ese alto y
// cada pieza se coloca según su postura: el afiche de la cadena arriba, mirando hacia la derecha; la cara asoma
// por la esquina superior derecha hacia los productos; el retrato del brazo en alto baja por el costado; los ojos
// lo cruzan; la rubia de ojos rojos ocupa el medio, de frente; y la figura agachada, volteada, estira el brazo
// hacia las preguntas desde abajo. `delay` escalona su entrada.
const COLLAGE = [
  {
    src: poster,
    className:
      "left-[0%] top-[1%] w-[94%] -rotate-[2.5deg] shadow-[0_26px_40px_rgba(0,0,0,0.65)]",
    delay: "0.2s",
  },
  {
    src: face,
    className: "-right-[10%] top-[0%] h-[16%] w-auto max-w-none",
    style: {
      WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent)",
      maskImage: "linear-gradient(to bottom, #000 58%, transparent)",
    },
    delay: "0.7s",
  },
  {
    src: zineA,
    className:
      "left-[2%] top-[21%] w-[44%] rotate-[3deg] border border-white/25 shadow-[0_26px_40px_rgba(0,0,0,0.7)]",
    delay: "0.4s",
  },
  {
    src: eyes,
    className:
      "right-[1%] top-[27%] w-[40%] rotate-[4deg] opacity-90 shadow-[0_22px_34px_rgba(0,0,0,0.65)]",
    delay: "0.55s",
  },
  {
    src: halo,
    className:
      "left-[12%] top-[46%] w-[70%] -rotate-[2deg] shadow-[0_26px_40px_rgba(0,0,0,0.7)]",
    delay: "0.85s",
  },
  {
    src: zineB,
    className:
      "left-[6%] top-[68%] w-[58%] -scale-x-100 rotate-[4deg] shadow-[0_26px_40px_rgba(0,0,0,0.65)]",
    delay: "1s",
  },
];

// Retrato de la derecha, junto al título de las FAQs (recorte sin el texto del afiche original): llena el hueco
// que queda a la derecha de «FAQs» y mira hacia el interior de la página.
const SIDE_PIECE = {
  src: typa,
  className:
    "right-[3%] top-[71.5%] w-[15%] rotate-[3deg] shadow-[0_26px_40px_rgba(0,0,0,0.7)]",
  delay: "1.1s",
};

// Cintas rojas pegadas en las esquinas de las piezas (color de acento de la marca).
const TAPES = [
  "left-[-2%] top-[0.8%] -rotate-[38deg]",
  "left-[26%] top-[20.2%] rotate-[8deg]",
  "right-[6%] top-[46%] -rotate-[22deg]",
  "right-[10%] top-[67.5%] rotate-[14deg]",
];

// Bloque de la tienda de la home: envuelve "Be unique" (ShopTabs) y las FAQs, y dibuja a la izquierda un collage
// que cubre todo el alto de ambas secciones, para que ninguna quede vacía. En móvil no se muestra el collage.
function ShopCollage({ children }) {
  return (
    <div className="relative overflow-hidden bg-black">
      {/* Banda ancha con los ojos, muy tenue, que cierra el bloque por abajo. */}
      <img
        src={eyes}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="shop-piece pointer-events-none absolute inset-x-0 bottom-0 hidden h-72 w-full object-cover object-[50%_14%] opacity-25 mix-blend-screen lg:block"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, transparent, #000 25%, #000 45%, transparent)",
          maskImage:
            "linear-gradient(to top, transparent, #000 25%, #000 45%, transparent)",
          "--piece-delay": "0.2s",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden px-10 lg:block"
      >
        <img
          src={SIDE_PIECE.src}
          alt=""
          loading="lazy"
          className={`shop-piece absolute ${SIDE_PIECE.className}`}
          style={{ "--piece-delay": SIDE_PIECE.delay }}
        />
        <span
          className="shop-piece absolute right-[14.5%] top-[71%] z-10 h-6 w-20 rotate-[-12deg] bg-accent/90 shadow-md"
          style={{ "--piece-delay": "1.2s" }}
        />
        <div className="mx-auto grid h-full max-w-7xl gap-12 lg:grid-cols-[5fr_7fr]">
          <div className="relative h-full">
            {COLLAGE.map((piece) => (
              <img
                key={piece.src}
                src={piece.src}
                alt=""
                loading="lazy"
                className={`shop-piece absolute ${piece.className}`}
                style={{ ...piece.style, "--piece-delay": piece.delay }}
              />
            ))}
            {TAPES.map((position) => (
              <span
                key={position}
                className={`shop-piece absolute z-10 h-6 w-20 bg-accent/90 shadow-md ${position}`}
                style={{ "--piece-delay": "0.9s" }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default ShopCollage;
