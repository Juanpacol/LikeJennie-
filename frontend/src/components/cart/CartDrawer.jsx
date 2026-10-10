import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/order.service";
import { formatPrice } from "../../utils/formatPrice";
import CartItem from "./CartItem";

function CartDrawer() {
  const { items, total, isOpen, close, clear } = useCart();
  const [step, setStep] = useState("cart"); // "cart" | "checkout" | "success"
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  function handleClose() {
    close();
    setStep("cart");
    setError(null);
  }

  async function handleCheckout(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createOrder({
        customerName,
        customerEmail,
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
      });
      clear();
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {step === "success" ? "¡Pedido confirmado!" : "Tu carrito"}
          </h2>
          <button type="button" onClick={handleClose} className="text-sm text-gray-500">
            Cerrar
          </button>
        </div>

        {step === "success" && (
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Gracias por tu compra. Este es un simulacro de checkout del proyecto académico.</p>
          </div>
        )}

        {step === "cart" && (
          <>
            {items.length === 0 ? (
              <p className="mt-8 text-sm text-gray-500">Tu carrito está vacío.</p>
            ) : (
              <>
                <div className="mt-4 flex-1 overflow-y-auto">
                  {items.map((item) => (
                    <CartItem key={item.variantId} item={item} />
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="mt-4 w-full rounded-full bg-black py-3 text-sm text-white"
                  >
                    Finalizar compra
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={handleCheckout} className="mt-6 flex flex-1 flex-col">
            <label className="text-sm font-medium" htmlFor="customerName">
              Nombre
            </label>
            <input
              id="customerName"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm"
            />

            <label className="mt-4 text-sm font-medium" htmlFor="customerEmail">
              Email
            </label>
            <input
              id="customerEmail"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm"
            />

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-auto space-y-2 pt-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-black py-3 text-sm text-white disabled:opacity-50"
              >
                {submitting ? "Procesando..." : "Confirmar pedido"}
              </button>
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="w-full text-center text-xs text-gray-500 underline"
              >
                Volver al carrito
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
