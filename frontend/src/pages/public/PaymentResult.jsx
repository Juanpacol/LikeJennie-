import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ORDER_PHRASE } from "../../data/phrases";

// Página a la que Stripe devuelve al cliente. Con `success` el pago se completó (el stock y el estado del
// pedido los confirma el webhook del backend) y se vacía el carrito; si no, el cliente canceló y el carrito
// se conserva para que pueda reintentar.
function PaymentResult({ success }) {
  const { clear, open } = useCart();

  useEffect(() => {
    if (success) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20 text-white sm:px-10">
      <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
        {success ? "Pago aprobado · Modo de prueba" : "Pago cancelado"}
      </p>
      <h1 className="animate-fade-up mt-4 font-condensed text-[clamp(3.5rem,10vw,8rem)] font-light uppercase leading-[0.9] [animation-delay:80ms]">
        {success ? "Pedido confirmado" : "No se cobró nada"}
      </h1>
      <p className="animate-fade-up mt-6 max-w-md font-display text-sm text-white/70 [animation-delay:160ms] sm:text-base">
        {success
          ? `${ORDER_PHRASE} Gracias por tu compra. Este pago se hizo con una tarjeta de prueba de Stripe: no se movió dinero real.`
          : "Cancelaste el pago. Tu carrito sigue como lo dejaste, así que puedes volver a intentarlo cuando quieras."}
      </p>
      <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
        <Link
          to="/catalogo"
          className="btn-sweep bg-white px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-black [--sweep:rgb(0_0_0/0.12)]"
        >
          {success ? "Seguir comprando" : "Ver tienda"}
        </Link>
        {!success && (
          <button
            type="button"
            onClick={open}
            className="border border-white/50 px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            Volver al carrito
          </button>
        )}
      </div>
    </section>
  );
}

export default PaymentResult;
