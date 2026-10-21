import { Children, cloneElement, isValidElement, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// Dock estilo macOS (basado en el de Magic UI): los íconos cercanos al cursor se agrandan y el
// efecto se desvanece con la distancia. `direction` indica el eje del dock.
// El contenedor reserva el espacio del tamaño máximo para que el layout de alrededor no salte.
export function Dock({
  children,
  direction = "horizontal",
  size = 24,
  magnification = 34,
  distance = 90,
  className = "",
}) {
  const pointer = useMotionValue(Infinity);
  const isHorizontal = direction === "horizontal";

  function handleMove(event) {
    pointer.set(isHorizontal ? event.clientX : event.clientY);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => pointer.set(Infinity)}
      className={`flex items-center gap-3 ${isHorizontal ? "flex-row" : "flex-col"} ${className}`}
      style={isHorizontal ? { minHeight: magnification } : { minWidth: magnification }}
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, { pointer, isHorizontal, size, magnification, distance })
          : child,
      )}
    </motion.div>
  );
}

export function DockIcon({ pointer, isHorizontal, size, magnification, distance, className = "", children }) {
  const ref = useRef(null);

  // Distancia del cursor al centro de este ícono, en el eje del dock.
  const offset = useTransform(pointer, (value) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    const center = isHorizontal ? bounds.x + bounds.width / 2 : bounds.y + bounds.height / 2;
    return value - center;
  });

  const target = useTransform(offset, [-distance, 0, distance], [size, magnification, size]);
  const animatedSize = useSpring(target, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width: animatedSize, height: animatedSize }}
      className={`relative flex items-center justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}
