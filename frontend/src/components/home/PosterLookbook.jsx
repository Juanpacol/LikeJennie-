import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import footerStage from "../../assets/cutouts/footer-stage.webp";
import sessionPose from "../../assets/cutouts/session-pose.webp";
import sessionSuit from "../../assets/cutouts/session-suit.webp";

// Figuras recortadas, de atrás hacia delante. `box` da su posición y alto (en % de la sección) para
// móvil y, con el prefijo md:, para escritorio (en móvil se muestran solo dos). Las tres son de la
// misma sesión en blanco y negro, así que se ven unificadas; `depth` es cuántos px
// se desplazan con el mouse (más = más cerca).
const FIGURES = [
  {
    src: sessionSuit,
    alt: "Jennie de pie con traje de rayas, mirando hacia arriba",
    box: "bottom-[-3%] left-[0%] h-[56%] md:left-[9%] md:h-[78%]",
    depth: 20,
    z: 20,
  },
  {
    src: footerStage,
    alt: "Jennie de pie con botas y falda de mezclilla",
    box: "hidden md:block md:bottom-[2%] md:left-[68%] md:h-[80%]",
    mono: true,
    depth: 24,
    z: 20,
  },
  {
    src: sessionPose,
    alt: "Jennie en una pierna con el cuerpo arqueado",
    box: "bottom-0 left-[44%] h-[58%] md:left-[40%] md:h-[88%]",
    depth: 32,
    z: 30,
  },
];

// Una capa que reacciona al mouse (parallax suave) y entra subiendo desde abajo.
function Layer({
  pointerX,
  pointerY,
  depth,
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
      <motion.div style={{ x, y }} className="h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

// Sección de pantalla completa tipo póster (inspirada en un diseño de referencia): "RUBY" enorme en
// rojo detrás, figuras recortadas delante que lo tapan en parte, y "JENNIE" acostada en el suelo
// con perspectiva. Las capas se mueven a distinta velocidad con el mouse para dar profundidad.
function PosterLookbook() {
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
      aria-label="Lookbook"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#0b0b0b] text-white"
    >
      {/* Resplandor rojo de fondo. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(214,0,28,0.28),transparent_62%)]" />

      {/* Palabra gigante, atrás de todo. */}
      <Layer
        pointerX={pointerX}
        pointerY={pointerY}
        depth={-6}
        className="pointer-events-none absolute inset-x-0 top-[24%] z-0 text-center md:top-[5%]"
      >
        <p
          aria-hidden="true"
          className="select-none font-condensed text-[min(54vw,66vh)] font-semibold uppercase leading-[0.82] tracking-[0.04em] text-accent md:-translate-x-[9%]"
        >
          Idol
        </p>
      </Layer>

      {/* Palabra enorme "en el suelo": en perspectiva, inclinada en diagonal y cortada por los bordes,
          como en el póster de referencia. Las figuras proyectan su sombra sobre las letras. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[58%] overflow-hidden [perspective:620px] [mask-image:linear-gradient(to_top,#000_55%,transparent)]">
        <p
          aria-hidden="true"
          className="absolute -left-[6%] top-[12%] w-[112%] origin-center select-none whitespace-nowrap text-center font-condensed text-[min(52vw,64vh)] font-semibold uppercase leading-none tracking-[0.03em] text-white/90 [transform:rotateX(66deg)_rotateZ(-9deg)]"
        >
          Jennie
        </p>
      </div>

      {/* Figuras recortadas. */}
      {FIGURES.map((figure, index) => (
        <Layer
          key={figure.src}
          pointerX={pointerX}
          pointerY={pointerY}
          depth={figure.depth}
          index={index}
          className={`pointer-events-none absolute ${figure.box}`}
          style={{ zIndex: figure.z }}
        >
          <img
            src={figure.src}
            alt={figure.alt}
            loading="lazy"
            className={`h-full w-auto max-w-none object-contain object-bottom ${figure.mono ? "[filter:grayscale(1)_contrast(1.08)_drop-shadow(18px_34px_26px_rgba(0,0,0,0.85))]" : "[filter:contrast(1.08)_drop-shadow(18px_34px_26px_rgba(0,0,0,0.85))]"}`}
          />
        </Layer>
      ))}

      {/* Textos pequeños de los costados. */}
      <div
        aria-hidden="true"
        className="absolute left-[22%] right-[12%] top-[88px] z-40 hidden items-center gap-4 md:flex"
      >
        <span className="font-display text-[11px] tracking-[0.3em] text-white/70">
          2026
        </span>
        <span className="h-px flex-1 bg-white/35" />
      </div>

      <div className="absolute left-6 top-28 z-40 max-w-[12.5rem] sm:left-10 lg:top-36">
        <p className="font-display text-[11px] uppercase tracking-[0.3em] text-white/60">
          Lookbook · 2026
        </p>
        <p className="mt-4 hidden font-display text-xs leading-relaxed text-white/70 sm:block">
          Prendas, accesorios y música del universo Ruby. Tres poses, una
          sesión, un mismo rojo.
        </p>
        <Link
          to="/catalogo"
          className="btn-sweep pointer-events-auto mt-6 inline-block bg-white px-6 py-2.5 font-display text-xs uppercase tracking-widest text-black [--sweep:rgb(0_0_0/0.12)]"
        >
          Ver tienda
        </Link>
      </div>

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
        className="absolute right-6 top-[17.5rem] z-40 hidden font-display text-[11px] uppercase tracking-[0.3em] text-white/70 sm:right-10 md:block lg:top-[19rem]"
      >
        Jennie
      </p>

      <p className="absolute bottom-5 left-6 z-40 font-display text-[11px] uppercase tracking-widest text-white/50 sm:left-10">
        © 2026 Ruby.
      </p>
    </section>
  );
}

export default PosterLookbook;
