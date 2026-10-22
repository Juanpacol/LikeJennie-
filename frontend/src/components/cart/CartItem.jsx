import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";

const STEP_BUTTON_CLASS =
  "flex h-8 w-8 items-center justify-center border border-white/30 text-base leading-none transition hover:border-white hover:bg-white hover:text-black";

// Una fila del carrito: foto, datos de la variante, cantidad y subtotal de la línea.
function CartItem({ item, index = 0 }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div
      className="animate-fade-up flex gap-4 border-b border-white/15 py-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <img
        src={item.image}
        alt={item.productName}
        className="h-28 w-[5.5rem] shrink-0 bg-neutral-900 object-cover"
      />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-sm uppercase leading-snug tracking-wide">
            {item.productName}
          </p>
          <p className="shrink-0 font-display text-sm">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
          {item.size} / {item.color}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-3">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={() =>
              updateQuantity(item.variantId, Math.max(1, item.quantity - 1))
            }
            className={STEP_BUTTON_CLASS}
          >
            −
          </button>
          <span className="w-5 text-center font-mono text-xs">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
            className={STEP_BUTTON_CLASS}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="hover-underline ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
