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
      className={`fixed right-4 top-24 z-40 flex w-[26rem] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl bg-lilac p-3 font-display text-lilac-deep shadow-2xl ${
        leaving ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      {item.image && (
        <img
          src={item.image}
          alt=""
          className="h-14 w-11 shrink-0 bg-white/40 object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="whitespace-nowrap text-[11px] uppercase tracking-widest">
          Agregado al carrito
        </p>
        <p className="truncate text-sm">{item.productName}</p>
        <p className="text-xs opacity-70">
          {item.size} / {item.color}
        </p>
      </div>
      <button
        type="button"
        onClick={handleViewCart}
        className="shrink-0 bg-lilac-deep px-3 py-2 text-xs uppercase tracking-widest text-white transition hover:opacity-80"
      >
        Ver carrito
      </button>
      <button
        type="button"
        onClick={dismissAdded}
        aria-label="Cerrar aviso"
        className="shrink-0 px-1 text-lg leading-none opacity-70 transition hover:opacity-100"
      >
        ×
      </button>
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
