import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// Transición entre el hero y el resto de la home (efecto de "telón", como el del footer pero al
// revés): en escritorio el hero se queda fijo y el contenido sube por encima de él, mientras el
// hero se aleja un poco (se encoge y se oscurece). Solo se animan transform y opacidad, que
// hace la GPU sin repintar. En móvil, o si el sistema pide menos movimiento, no hay efecto.
function HeroCurtain({ hero, children }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  // Recorrido de la transición: lo que mide la ventana.
  const distance = () =>
    typeof window === "undefined" ? 900 : window.innerHeight;
  // Solo desde 768 px: en móvil el hero no queda fijo y encogerlo dejaría huecos.
  const active = () => !reduced && window.innerWidth >= 768;
  const scale = useTransform(scrollY, (y) =>
    active() ? 1 - 0.08 * Math.min(1, y / distance()) : 1,
  );
  const shade = useTransform(scrollY, (y) =>
    active() ? 0.75 * Math.min(1, y / distance()) : 0,
  );

  return (
    <div className="relative">
      <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <motion.div
          style={{ scale, transformOrigin: "50% 0%" }}
          className="h-full will-change-transform"
        >
          {hero}
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 hidden bg-black md:block"
        />
      </div>
      <div className="relative z-10 border-t border-white/15 bg-black shadow-[0_-40px_80px_rgba(0,0,0,0.7)]">
        {children}
      </div>
    </div>
  );
}

export default HeroCurtain;
