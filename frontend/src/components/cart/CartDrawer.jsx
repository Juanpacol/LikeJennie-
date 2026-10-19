import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/order.service";
import { formatPrice } from "../../utils/formatPrice";
import CartItem from "./CartItem";

const INPUT_CLASS =
  "mt-1 w-full border border-lilac-deep/30 bg-white/40 px-3 py-2 font-display text-sm text-lilac-deep placeholder:text-lilac-deep/50 focus:border-lilac-deep focus:outline-none";
const PRIMARY_BUTTON_CLASS =
  "w-full bg-white/70 py-3 font-display text-xs uppercase tracking-widest text-lilac-deep transition hover:bg-white disabled:opacity-50";

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
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <aside className="relative flex h-full w-full max-w-md flex-col rounded-l-3xl bg-lilac p-6 font-display text-lilac-deep shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">{step === "success" ? "¡Pedido confirmado!" : "Tu carrito"}</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-lilac-deep/60 text-lg leading-none transition hover:bg-white/50"
          >
            ×
          </button>
        </div>

        {step === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-sm">
              Gracias por tu compra. Este es un simulacro de checkout del proyecto académico.
            </p>
            <button type="button" onClick={handleClose} className={`${PRIMARY_BUTTON_CLASS} mt-6`}>
              Seguir comprando
            </button>
          </div>
        )}

        {step === "cart" && items.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-xl">Tu carrito está vacío</p>
            <p className="mt-1 text-sm">
              ¿Tienes cuenta?{" "}
              <Link to="/admin/login" onClick={handleClose} className="underline">
                Inicia sesión
              </Link>{" "}
              para pagar más rápido.
            </p>
            <Link
              to="/catalogo"
              onClick={handleClose}
              className="mt-6 bg-white/70 px-8 py-3 text-xs uppercase tracking-widest transition hover:bg-white"
            >
              Seguir comprando
            </Link>
          </div>
        )}

        {step === "cart" && items.length > 0 && (
          <>
            <div className="mt-4 flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.variantId} item={item} />
              ))}
            </div>
            <div className="border-t border-lilac-deep/20 pt-4">
              <div className="flex justify-between text-sm">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep("checkout")}
                className={`${PRIMARY_BUTTON_CLASS} mt-4`}
              >
                Finalizar compra
              </button>
            </div>
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={handleCheckout} className="mt-6 flex flex-1 flex-col">
            <label className="text-sm" htmlFor="customerName">
              Nombre
            </label>
            <input
              id="customerName"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={INPUT_CLASS}
            />

            <label className="mt-4 text-sm" htmlFor="customerEmail">
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

            {error && <p className="mt-3 text-sm text-accent">{error}</p>}

            <div className="mt-auto space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button type="submit" disabled={submitting} className={PRIMARY_BUTTON_CLASS}>
                {submitting ? "Procesando..." : "Confirmar pedido"}
              </button>
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="w-full text-center text-xs underline"
              >
                Volver al carrito
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
