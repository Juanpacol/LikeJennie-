import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import rubia from "../../assets/cutouts/shop-rubia.webp";
import zineA from "../../assets/cutouts/shop-zine-a.webp";
import zineB from "../../assets/cutouts/shop-zine-b.webp";
import face from "../../assets/cutouts/shop-face.webp";
import poster from "../../assets/cutouts/shop-poster.webp";
import mono from "../../assets/cutouts/shop-mono.webp";
import dark from "../../assets/cutouts/shop-dark.webp";

const SHADOW = "shadow-[0_26px_40px_rgba(0,0,0,0.65)]";

// Elementos gráficos del collage (no son fotos): rellenan los huecos entre las fotos y las unen.
const STAR = "M50 2 62 36 98 38 69 60 79 95 50 74 21 95 31 60 2 38 38 36Z";

function Scribble({ className }) {
  return (
    <svg
      viewBox="0 0 220 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 70C40 20 90 8 120 40S60 100 44 62 110 4 170 30s30 70-18 78"
        stroke="#D6001C"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Star({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d={STAR}
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M50 22 57 40 76 42 61 54 66 73 50 62 34 73 39 54 24 42 43 40Z"
        fill="#fff"
      />
    </svg>
  );
}

function Barcode({ className }) {
  const bars = [
    3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 2, 1, 3,
  ];
  let x = 0;
  return (
    <svg viewBox="0 0 90 60" className={className} aria-hidden="true">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 && (
          <rect key={i} x={x} y="0" width={w * 1.4} height="46" fill="#fff" />
        );
        x += w * 1.4;
        return rect;
      })}
      <text
        x="0"
        y="58"
        fill="#fff"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="3"
      >
        N° 027
      </text>
    </svg>
  );
}

// Palabra gigante en contorno, vertical, que cruza la columna por detrás de las fotos.
function GiantWord({ className }) {
  return (
    <p
      className={`select-none whitespace-nowrap font-condensed font-light uppercase leading-none [text-orientation:mixed] [writing-mode:vertical-rl] ${className}`}
      style={{
        fontSize: "15rem",
        color: "transparent",
        WebkitTextStroke: "1px rgba(255,255,255,0.2)",
        transform: "rotate(180deg)",
      }}
    >
      Unique
    </p>
  );
}

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
    src: rubia,
    pos: "left-[1%] top-[27%] w-[31%]",
    look: `-rotate-[5deg] ${SHADOW}`,
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
    src: mono,
    pos: "left-[5%] top-[38%] w-[64%]",
    look: `-rotate-[2deg] ${SHADOW}`,
    speed: 80,
    delay: "0.7s",
    tape: "-top-3 right-[12%] rotate-[10deg]",
  },
  {
    src: zineB,
    pos: "-left-[4%] top-[63%] w-[60%]",
    look: `-scale-x-100 rotate-[4deg] ${SHADOW}`,
    speed: -70,
    delay: "1s",
  },
  { id: "word", node: <GiantWord />, pos: "-left-[1%] top-[27%]", speed: 30 },
  {
    id: "scribble",
    node: <Scribble className="h-full w-full" />,
    pos: "left-[34%] top-[20.5%] w-[46%]",
    speed: -90,
    front: true,
  },
  {
    id: "star-a",
    node: <Star className="h-full w-full" />,
    pos: "left-[60%] top-[55%] w-[12%]",
    speed: 110,
  },
  {
    id: "star-b",
    node: <Star className="h-full w-full" />,
    pos: "left-[2%] top-[56%] w-[7%]",
    speed: -60,
  },
  {
    id: "barcode",
    node: <Barcode className="h-full w-full" />,
    pos: "left-[66%] top-[86%] w-[26%]",
    speed: 40,
    look: "opacity-70",
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
    id: "faq-scribble",
    side: true,
    node: <Scribble className="h-full w-full" />,
    pos: "right-[8%] top-[73%] w-[16%]",
    speed: 50,
  },
  {
    id: "faq-star",
    side: true,
    node: <Star className="h-full w-full" />,
    pos: "right-[4%] top-[80.5%] w-[6%]",
    speed: -40,
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
        {piece.node ? (
          <div className={`shop-piece h-full w-full ${piece.look ?? ""}`}>
            {piece.node}
          </div>
        ) : (
          <img
            src={piece.src}
            alt=""
            loading="lazy"
            className={`shop-piece block h-full w-full object-cover ${piece.look}`}
            style={{ "--piece-delay": piece.delay }}
          />
        )}
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
      key={piece.id ?? piece.src}
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
      {/* Foto oscura de ambiente detrás de las FAQs: se mezcla con el negro (screen) y se desvanece por arriba,
          por abajo y por los lados. */}
      <img
        src={dark}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="shop-piece pointer-events-none absolute bottom-0 right-0 hidden h-[34%] w-[64%] object-cover object-[50%_22%] opacity-50 mix-blend-screen lg:block"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, transparent, #000 22%, #000 70%, transparent), linear-gradient(to right, transparent, #000 40%, #000 80%, transparent)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(to top, transparent, #000 22%, #000 70%, transparent), linear-gradient(to right, transparent, #000 40%, #000 80%, transparent)",
          maskComposite: "intersect",
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
