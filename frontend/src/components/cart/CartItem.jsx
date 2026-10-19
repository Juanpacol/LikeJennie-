import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 border-b border-lilac-deep/15 py-4">
      <img src={item.image} alt={item.productName} className="h-20 w-16 object-cover" />

      <div className="flex-1">
        <p className="text-sm">{item.productName}</p>
        <p className="text-xs text-lilac-deep">
          {item.size} / {item.color}
        </p>
        <p className="mt-1 text-sm">{formatPrice(item.price)}</p>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
            className="h-6 w-6 border border-lilac-deep/40 text-sm"
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
            className="h-6 w-6 border border-lilac-deep/40 text-sm"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="ml-2 text-xs text-lilac-deep underline"
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
