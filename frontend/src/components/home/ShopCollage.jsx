import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import eyes from "../../assets/cutouts/shop-eyes.webp";
import zineA from "../../assets/cutouts/shop-zine-a.webp";
import zineB from "../../assets/cutouts/shop-zine-b.webp";
import face from "../../assets/cutouts/shop-face.webp";
import poster from "../../assets/cutouts/shop-poster.webp";
import halo from "../../assets/cutouts/shop-halo.webp";
import typa from "../../assets/cutouts/shop-typa.webp";

const SHADOW = "shadow-[0_26px_40px_rgba(0,0,0,0.65)]";

// Piezas del collage (solo escritorio), todas en blanco y negro de alto contraste (estilo fotocopia).
// `pos`: posición y ancho como porcentajes del bloque entero (tienda + FAQs) o, con `side`, de todo su ancho.
// `look`: giro, sombra y marco. `speed`: cuántos px se desplaza la pieza a lo largo del scroll del bloque (las
// de `front` van delante de los productos y se mueven más, así hay profundidad). `tape`: cinta roja pegada a la
// pieza (se mueve con ella). Los tamaños varían a propósito: el afiche de la cadena es enorme y se sale del
// borde, y el retrato del brazo en alto se monta sobre la primera tarjeta de producto.
const PIECES = [
  {
    src: poster,
    pos: "-left-[9%] top-[0.6%] w-[112%]",
    look: `-rotate-[2.5deg] ${SHADOW}`,
    speed: 60,
    delay: "0.2s",
    tape: "-top-3 left-[7%] -rotate-[38deg]",
  },
  {
    src: eyes,
    pos: "left-[1%] top-[27.5%] w-[27%]",
    look: `-rotate-[5deg] opacity-90 ${SHADOW}`,
    speed: -50,
    delay: "0.55s",
  },
  {
    src: zineA,
    pos: "left-[72%] top-[20%] w-[36%]",
    look: `rotate-[5deg] border border-white/25 shadow-[0_30px_50px_rgba(0,0,0,0.8)]`,
    speed: -140,
    delay: "0.4s",
    front: true,
    tape: "-top-3 left-[30%] rotate-[8deg]",
  },
  {
    src: halo,
    pos: "left-[8%] top-[45%] w-[80%]",
    look: `-rotate-[2deg] ${SHADOW}`,
    speed: 90,
    delay: "0.85s",
    tape: "-top-3 right-[8%] -rotate-[22deg]",
  },
  {
    src: zineB,
    pos: "-left-[4%] top-[67%] w-[56%]",
    look: `-scale-x-100 rotate-[4deg] ${SHADOW}`,
    speed: -70,
    delay: "1s",
  },
  // Fuera de la columna (posición respecto a todo el ancho del bloque): llenan los huecos a la derecha de los
  // títulos. La cara recortada mira hacia el interior desde la derecha de «Be unique»; el retrato claro se
  // pega a la derecha de «FAQs».
  {
    src: face,
    side: true,
    pos: "right-[6%] top-[0.8%] h-[14%]",
    look: "w-auto max-w-none [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]",
    speed: -40,
    delay: "0.7s",
  },
  {
    src: typa,
    side: true,
    pos: "right-[3%] top-[71.5%] w-[15%]",
    look: `rotate-[3deg] ${SHADOW}`,
    speed: 50,
    delay: "1.1s",
    tape: "-top-3 left-[10%] -rotate-[12deg]",
  },
];

// Una pieza: el contenedor se mueve con el scroll (parallax) y la foto se endereza y crece al pasar el mouse.
function Piece({ piece, progress, reduced }) {
  const y = useTransform(
    progress,
    [0, 1],
    reduced ? [0, 0] : [piece.speed, -piece.speed],
  );
  return (
    <motion.div className={`absolute ${piece.pos}`} style={{ y }}>
      <motion.div
        className="pointer-events-auto relative h-full w-full"
        whileHover={reduced ? undefined : { scale: 1.05, rotate: 0, zIndex: 5 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <img
          src={piece.src}
          alt=""
          loading="lazy"
          className={`shop-piece block h-full w-full object-cover ${piece.look}`}
          style={{ "--piece-delay": piece.delay }}
        />
        {piece.tape && (
          <span
            className={`shop-piece absolute z-10 h-6 w-20 bg-accent/90 shadow-md ${piece.tape}`}
            style={{ "--piece-delay": "0.9s" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

// Capa de piezas: `side` pone las que están fuera de la columna; `front` elige si van detrás o delante del contenido.
function Layer({ side, front, progress, reduced }) {
  const pieces = PIECES.filter(
    (p) => Boolean(p.side) === side && Boolean(p.front) === front,
  );
  if (pieces.length === 0) return null;
  const inner = pieces.map((piece) => (
    <Piece
      key={piece.src}
      piece={piece}
      progress={progress}
      reduced={reduced}
    />
  ));
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 hidden px-10 lg:block ${front ? "z-20" : "z-0"}`}
    >
      {side ? (
        inner
      ) : (
        <div className="mx-auto grid h-full max-w-7xl gap-12 lg:grid-cols-[5fr_7fr]">
          <div className="relative h-full">{inner}</div>
        </div>
      )}
    </div>
  );
}

// Bloque de la tienda de la home: envuelve "Be unique" (ShopTabs) y las FAQs, y dibuja a la izquierda un collage
// que cubre todo el alto de ambas secciones y se mueve con el scroll. En móvil no se muestra el collage.
function ShopCollage({ children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className="relative overflow-hidden bg-black">
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
      <Layer
        side={false}
        front={false}
        progress={scrollYProgress}
        reduced={reduced}
      />
      <Layer side front={false} progress={scrollYProgress} reduced={reduced} />
      <div className="relative z-10">{children}</div>
      <Layer side={false} front progress={scrollYProgress} reduced={reduced} />
      {/* Grano de fotocopia sobre todo el bloque. */}
      <div
        aria-hidden="true"
        className="shop-grain pointer-events-none absolute inset-0 z-30 hidden mix-blend-overlay lg:block"
      />
    </div>
  );
}

export default ShopCollage;
