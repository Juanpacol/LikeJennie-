import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";

const VISIBLE_MS = 4000;
const EXIT_MS = 250;

// Tarjeta del aviso. Se monta de nuevo con cada producto (key = id del aviso), así sus
// temporizadores y su estado de salida empiezan limpios.
function ToastCard({ item }) {
  const { dismissAdded, open, items, total } = useCart();
  const count = items.reduce((sum, line) => sum + line.quantity, 0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const removeTimer = setTimeout(dismissAdded, VISIBLE_MS + EXIT_MS);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, [dismissAdded]);

  function handleViewCart() {
    dismissAdded();
    open();
  }

  return (
    <div
      role="status"
      className={`fixed right-4 top-24 z-40 w-[24rem] max-w-[calc(100vw-2rem)] ${
        leaving ? "animate-toast-out" : ""
      }`}
    >
      {/* La tarjeta aparece "cortada" en diagonal por la hoja; la hoja barre la tarjeta y luego
          queda como una katana negra cruzando el fondo. */}
      <div className="toast-slash relative overflow-hidden bg-accent text-white shadow-2xl">
        {/* Filo: línea blanca finísima a lo largo del corte diagonal. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <line
            x1="7.4"
            y1="0"
            x2="0.4"
            y2="100"
            stroke="#fff"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.85"
          />
        </svg>

        <div className="relative flex items-stretch gap-4 p-3 pl-9">
          {item.image && (
            <img
              src={item.image}
              alt=""
              className="h-24 w-[4.5rem] shrink-0 bg-[#141414] object-contain p-1 ring-1 ring-black/50"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
              Añadido al carrito
            </p>
            <p className="mt-1.5 truncate font-condensed text-2xl font-light uppercase leading-tight">
              {item.productName}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {item.size} / {item.color}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90">
              {count} {count === 1 ? "artículo" : "artículos"} ·{" "}
              {formatPrice(total)}
            </p>
            <button
              type="button"
              onClick={handleViewCart}
              className="btn-sweep mt-3 w-fit bg-black px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white [--sweep:rgb(255_255_255/0.2)]"
            >
              Ver carrito
            </button>
          </div>
          <button
            type="button"
            onClick={dismissAdded}
            aria-label="Cerrar aviso"
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center text-lg leading-none text-white/80 transition hover:text-white"
          >
            ×
          </button>
        </div>
        {/* Barra negra que se vacía y marca cuánto falta para que el aviso se cierre. */}
        <div
          aria-hidden="true"
          className="relative h-0.5 origin-left animate-toast-progress bg-black"
          style={{ animationDuration: `${VISIBLE_MS}ms` }}
        />
      </div>
    </div>
  );
}

// Aviso que entra desde la derecha al agregar un producto, con acceso directo al carrito.
function CartToast() {
  const { lastAdded } = useCart();
  if (!lastAdded) return null;
  return <ToastCard key={lastAdded.toastId} item={lastAdded} />;
}

export default CartToast;
