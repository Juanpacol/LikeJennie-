import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../../context/CartContext";
import { createCheckoutSession } from "../../services/order.service";
import { formatPrice } from "../../utils/formatPrice";
import silhouette from "../../assets/cart-silhouette.jpg";
import CartItem from "./CartItem";

const EASE = [0.16, 1, 0.3, 1];

// Borde izquierdo del panel: un único tajo diagonal, recto y limpio (como un corte de katana). Cada
// punto es [y %, x %]; el panel se recorta con ellos (clip-path) y se revela barriendo de derecha a izquierda.
const EDGE = [
  [0, 10],
  [100, 0],
];
const polygon = (x) =>
  `polygon(${EDGE.map(([y, ex]) => `${x ?? ex}% ${y}%`).join(", ")}, 100% 100%, 100% 0%)`;
const CLOSED = polygon(100);
const OPEN = polygon();
const LABEL_CLASS = "font-mono text-[11px] uppercase tracking-[0.2em]";
const INPUT_CLASS =
  "mt-2 w-full border-0 border-b border-white/50 bg-transparent px-0 py-3 font-display text-base text-white placeholder:text-white/80 transition-colors focus:border-black focus:outline-none";
const PRIMARY_BUTTON_CLASS = `btn-sweep w-full bg-black py-4 text-white [--sweep:rgb(255_255_255/0.2)] disabled:opacity-50 ${LABEL_CLASS}`;
const STEPS = ["Carrito", "Datos", "Pago"];

// Indicador de pasos: el actual en blanco, el resto atenuado.
function Steps({ current }) {
  return (
    <ol className="mt-3 flex gap-4">
      {STEPS.map((name, index) => (
        <li
          key={name}
          className={`${LABEL_CLASS} transition-colors ${index === current ? "text-white" : "text-white/50"}`}
        >
          0{index + 1} {name}
        </li>
      ))}
    </ol>
  );
}

// Carrito lateral: panel negro que entra deslizando desde la derecha, con la misma tipografía
// (condensada para los títulos, monoespaciada para las etiquetas) y el rojo de la marca como acento.
function CartDrawer() {
  const { items, total, isOpen, close } = useCart();
  const [step, setStep] = useState("cart"); // "cart" | "checkout"
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleClose() {
    close();
    setStep("cart");
    setError(null);
  }

  // Escape cierra el carrito.
  useEffect(() => {
    if (!isOpen) return undefined;
    function onKey(event) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function handleCheckout(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // El pedido se crea en PENDING y el pago se hace en la página de Stripe; el carrito se vacía
      // al volver a /pago/exito.
      const { url } = await createCheckoutSession({
        customerName,
        customerEmail,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
      window.location.assign(url);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  const stepIndex = { cart: 0, checkout: 1 }[step];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-black/70"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            className="relative isolate flex h-full w-full max-w-md flex-col overflow-hidden bg-accent py-6 pl-14 pr-6 text-white sm:py-8 sm:pl-16 sm:pr-8"
            initial={{ clipPath: CLOSED, x: "6%", opacity: 0 }}
            animate={{ clipPath: OPEN, x: 0, opacity: 1 }}
            exit={{ clipPath: CLOSED, x: "6%", opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Foto en silueta fundida con el rojo. */}
            <img
              src={silhouette}
              alt=""
              aria-hidden="true"
              className="ink-art pointer-events-none absolute bottom-0 right-0 -z-10 h-[86%] w-auto max-w-none mix-blend-multiply"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent, #000 38%), linear-gradient(to right, transparent, #000 30%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to bottom, transparent, #000 38%), linear-gradient(to right, transparent, #000 30%)",
                maskComposite: "intersect",
              }}
            />
            {/* Filo: línea blanca finísima a lo largo del corte. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <line
                x1="10.4"
                y1="0"
                x2="0.4"
                y2="100"
                stroke="#fff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
            </svg>
            <div className="relative flex items-start justify-between">
              <div>
                <h2 className="font-condensed text-5xl font-light uppercase leading-none">
                  Tu carrito
                </h2>
                <Steps current={stepIndex} />
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar carrito"
                className="flex h-10 w-10 items-center justify-center border border-black/60 text-lg leading-none transition hover:bg-black hover:text-white"
              >
                ×
              </button>
            </div>

            {step === "cart" && items.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="animate-fade-up font-condensed text-8xl font-light uppercase leading-none text-black/30">
                  Vacío
                </p>
                <p className="mt-4 font-display text-sm text-white/70">
                  Aún no has añadido nada. Elige tu mundo y llévalo puesto.
                </p>
                <Link
                  to="/catalogo"
                  onClick={handleClose}
                  className={`${PRIMARY_BUTTON_CLASS} mt-8 block max-w-xs text-center`}
                >
                  Ver tienda
                </Link>
              </div>
            )}

            {step === "cart" && items.length > 0 && (
              <>
                <p className={`${LABEL_CLASS} mt-8 text-white/80`}>
                  {count} {count === 1 ? "artículo" : "artículos"}
                </p>
                <div data-lenis-prevent className="flex-1 overflow-y-auto">
                  {items.map((item, index) => (
                    <CartItem key={item.variantId} item={item} index={index} />
                  ))}
                </div>
                <div className="border-t border-white/15 pt-5">
                  <div className="flex items-end justify-between">
                    <span className={`${LABEL_CLASS} text-white/80`}>
                      Total
                    </span>
                    <span className="font-condensed text-4xl font-light leading-none">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className={`${PRIMARY_BUTTON_CLASS} mt-5`}
                  >
                    Finalizar compra
                  </button>
                </div>
              </>
            )}

            {step === "checkout" && (
              <form
                onSubmit={handleCheckout}
                className="animate-fade-up mt-10 flex flex-1 flex-col"
              >
                <label
                  className={`${LABEL_CLASS} text-white/80`}
                  htmlFor="customerName"
                >
                  Nombre
                </label>
                <input
                  id="customerName"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={INPUT_CLASS}
                />

                <label
                  className={`${LABEL_CLASS} mt-8 text-white/80`}
                  htmlFor="customerEmail"
                >
                  Email
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={INPUT_CLASS}
                />

                {error && (
                  <p
                    role="alert"
                    className="mt-4 font-display text-sm text-accent"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-auto space-y-4 pt-6">
                  <div className="flex items-end justify-between border-t border-white/15 pt-5">
                    <span className={`${LABEL_CLASS} text-white/80`}>
                      Total · {count} {count === 1 ? "artículo" : "artículos"}
                    </span>
                    <span className="font-condensed text-4xl font-light leading-none">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={PRIMARY_BUTTON_CLASS}
                  >
                    {submitting
                      ? "Redirigiendo a Stripe..."
                      : "Pagar con tarjeta"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className={`hover-underline mx-auto block text-white/80 transition hover:text-white ${LABEL_CLASS}`}
                  >
                    Volver al carrito
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
