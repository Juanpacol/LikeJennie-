import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

const VISIBLE_MS = 4000;
const EXIT_MS = 250;

// Tarjeta del aviso. Se monta de nuevo con cada producto (key = id del aviso), así sus
// temporizadores y su estado de salida empiezan limpios.
function ToastCard({ item }) {
  const { dismissAdded, open } = useCart();
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
      className={`fixed right-4 top-24 z-40 w-[24rem] max-w-[calc(100vw-2rem)] overflow-hidden border border-white/20 bg-[#0b0b0b] text-white shadow-2xl ${
        leaving ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      <div className="flex items-stretch gap-4 p-3">
        {item.image && (
          <img
            src={item.image}
            alt=""
            className="h-20 w-16 shrink-0 bg-neutral-900 object-cover"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
            <span className="h-1.5 w-1.5 bg-accent" />
            Añadido al carrito
          </p>
          <p className="mt-1.5 truncate font-condensed text-xl font-light uppercase leading-tight">
            {item.productName}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            {item.size} / {item.color}
          </p>
          <button
            type="button"
            onClick={handleViewCart}
            className="btn-sweep mt-auto w-fit bg-white px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-black [--sweep:rgb(0_0_0/0.12)]"
          >
            Ver carrito
          </button>
        </div>
        <button
          type="button"
          onClick={dismissAdded}
          aria-label="Cerrar aviso"
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center text-lg leading-none text-white/60 transition hover:text-white"
        >
          ×
        </button>
      </div>
      {/* Barra roja que se vacía y marca cuánto falta para que el aviso se cierre. */}
      <div
        aria-hidden="true"
        className="h-0.5 origin-left animate-toast-progress bg-accent"
        style={{ animationDuration: `${VISIBLE_MS}ms` }}
      />
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
