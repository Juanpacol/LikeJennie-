import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useScroll,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import sessionCoat from "../../assets/cutouts/session-coat.webp";
import sessionBlazer from "../../assets/cutouts/session-blazer.webp";
import sessionSuit from "../../assets/cutouts/session-suit.webp";

// Figuras recortadas, de atrás hacia delante. `box` da su posición y alto (en % de la sección) para
// móvil y, con el prefijo md:, para escritorio (en móvil se muestran solo dos). Las tres son de la
// misma sesión en blanco y negro, así que se ven unificadas; `depth` es cuántos px
// se desplazan con el mouse (más = más cerca).
const FIGURES = [
  {
    src: sessionBlazer,
    alt: "Jennie con un blazer negro oversize y un top blanco",
    box: "hidden md:block md:bottom-[-4%] md:left-[38%] md:h-[72%]",
    depth: 8,
    z: 22,
    rise: [32, -10],
  },
  {
    src: sessionSuit,
    alt: "Jennie de pie con traje de rayas, mirando hacia arriba",
    box: "bottom-[-3%] left-[0%] h-[56%] md:left-[10%] md:h-[66%]",
    depth: 20,
    z: 20,
    rise: [14, -22],
  },
  {
    src: sessionCoat,
    alt: "Jennie con un abrigo negro largo, mirando hacia abajo",
    box: "bottom-[-4%] left-[40%] h-[50%] md:left-[68%] md:h-[68%]",
    depth: 30,
    z: 30,
    rise: [22, -34],
  },
];

// Una capa que reacciona al mouse (parallax suave) y entra subiendo desde abajo.
function Layer({
  pointerX,
  pointerY,
  depth,
  scrollProgress,
  rise = [0, 0],
  index = 0,
  className = "",
  style,
  children,
}) {
  const reduced = useReducedMotion();
  const x = useSpring(
    useTransform(pointerX, (v) => (reduced ? 0 : v * depth * 2)),
    {
      stiffness: 80,
      damping: 18,
    },
  );
  const y = useSpring(
    useTransform(pointerY, (v) => (reduced ? 0 : v * depth * 1.2)),
    {
      stiffness: 80,
      damping: 18,
    },
  );

  // Al hacer scroll, cada capa sube a su propio ritmo: las lejanas poco y las cercanas mucho.
  const rising = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    reduced ? ["0%", "0%", "0%"] : [`${rise[0]}%`, "0%", `${rise[1]}%`],
  );

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div style={{ y: rising }} className="h-full w-full">
        <motion.div style={{ x, y }} className="h-full w-full">
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Sección de pantalla completa tipo póster (inspirada en un diseño de referencia): "RUBY" enorme en
// rojo detrás, figuras recortadas delante que lo tapan en parte, y "JENNIE" acostada en el suelo
// con perspectiva. Las capas se mueven a distinta velocidad con el mouse para dar profundidad.
function PosterLookbook() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  function handleMove(event) {
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left) / box.width - 0.5);
    pointerY.set((event.clientY - box.top) / box.height - 0.5);
  }

  function handleLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Lookbook"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#e9e9e9] text-[#0b0b0b]"
    >
      {/* Luz suave de estudio. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.9),transparent_65%)]" />

      {/* Título en dos líneas, alineado a la izquierda: las figuras se montan sobre él, como en el póster. */}
      <Layer
        pointerX={pointerX}
        pointerY={pointerY}
        depth={-6}
        scrollProgress={scrollYProgress}
        rise={[10, -12]}
        className="pointer-events-none absolute left-[3%] top-[20%] z-10 md:top-[10%]"
      >
        <p
          aria-hidden="true"
          className="select-none font-display text-[min(26vw,31vh)] font-semibold leading-[0.84] tracking-[-0.03em]"
        >
          Idol
          <br />
          <span className="text-[0.8em] uppercase">Jennie</span>
        </p>
      </Layer>

      {/* Palabra enorme "en el suelo": en perspectiva, inclinada y cortada por los bordes. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[58%] overflow-hidden [perspective:620px] [mask-image:linear-gradient(to_top,#000_55%,transparent)]">
        <p
          aria-hidden="true"
          className="absolute -left-[6%] top-[12%] w-[112%] origin-center select-none whitespace-nowrap text-center font-heavy text-[min(40vw,52vh)] font-extrabold uppercase leading-none tracking-[-0.03em] text-black/90 [transform:rotateX(66deg)_rotateZ(-9deg)]"
        >
          Ruby
        </p>
      </div>

      {/* Texto a la derecha de «Idol». */}
      <div className="absolute left-[42%] top-[21%] z-[15] hidden max-w-[17rem] md:block">
        <p className="font-display text-[11px] uppercase tracking-[0.3em] text-black/60">
          Lookbook · 2026
        </p>
        <p className="mt-3 font-display text-xs font-semibold leading-relaxed">
          Prendas, accesorios y música del universo Ruby. Una mirada, un mismo
          rojo.
        </p>
      </div>

      {/* Figuras recortadas. */}
      {FIGURES.map((figure, index) => (
        <Layer
          key={figure.src}
          pointerX={pointerX}
          pointerY={pointerY}
          depth={figure.depth}
          scrollProgress={scrollYProgress}
          rise={figure.rise}
          index={index}
          className={`pointer-events-none absolute ${figure.box}`}
          style={{ zIndex: figure.z }}
        >
          <div className="h-full [filter:contrast(1.05)_drop-shadow(16px_28px_22px_rgba(0,0,0,0.35))]">
            <img
              src={figure.src}
              alt={figure.alt}
              loading="lazy"
              className="h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_84%,transparent)]"
            />
          </div>
        </Layer>
      ))}

      {/* Textos pequeños de los costados. */}
      <div
        aria-hidden="true"
        className="absolute left-[58%] right-[12%] top-[88px] z-40 hidden items-center gap-4 md:flex"
      >
        <span className="font-display text-[11px] tracking-[0.3em] text-black/70">
          2026
        </span>
        <span className="h-px flex-1 bg-black/40" />
      </div>

      <Link
        to="/catalogo"
        className="btn-sweep absolute bottom-14 left-6 z-40 inline-block bg-black px-6 py-2.5 font-display text-xs uppercase tracking-widest text-white [--sweep:rgb(255_255_255/0.18)] sm:left-10 md:bottom-auto md:left-[64%] md:top-[21.5%] md:px-7 md:py-3"
      >
        Ver tienda
      </Link>

      <p
        aria-hidden="true"
        className="absolute right-6 top-28 z-40 hidden text-right font-condensed text-3xl font-semibold uppercase leading-[1.05] sm:block sm:right-10 lg:top-36 lg:text-4xl"
      >
        Wanna
        <br />
        rock
        <br />
        with
        <br />
        <span className="text-accent">this?</span>
      </p>
      <p
        aria-hidden="true"
        className="absolute right-6 top-[17.5rem] z-40 hidden font-display text-[11px] uppercase tracking-[0.3em] text-black/70 sm:right-10 md:block lg:top-[19rem]"
      >
        Jennie
      </p>

      <p className="absolute bottom-5 left-6 z-40 font-display text-[11px] uppercase tracking-widest text-black/50 sm:left-10">
        © 2026 Ruby.
      </p>
    </section>
  );
}

export default PosterLookbook;
