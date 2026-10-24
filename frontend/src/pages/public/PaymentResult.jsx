import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { collectionOfProduct } from "../../data/collections";
import { getCatalog } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";
import ProductCard from "../../components/product/ProductCard";
import silhouette from "../../assets/cart-silhouette.jpg";

const STEPS = [
  "Confirmamos tu pago",
  "Preparamos tu pedido",
  "Te escribimos al correo",
];

// Copia del carrito guardada por CartDrawer justo antes de ir a Stripe.
function readLastOrder() {
  try {
    return JSON.parse(sessionStorage.getItem("ruby_last_order"));
  } catch {
    return null;
  }
}

// Pantalla de confirmación del pago, con el lenguaje del carrito: un tajo diagonal revela el panel rojo, el
// pedido sale como una boleta y debajo se ofrecen otras piezas de la misma colección.
function Confirmed() {
  const [params] = useSearchParams();
  const order = useMemo(readLastOrder, []);
  const orderCode = (params.get("orden") ?? "").slice(-6).toUpperCase();
  const collection = collectionOfProduct(order?.items?.[0]?.productName ?? "");
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const bought = new Set(order?.items?.map((item) => item.productName));
    getCatalog()
      .then((all) =>
        setRelated(
          all
            .filter(
              (p) =>
                p.name.toLowerCase().includes(collection.match) &&
                !bought.has(p.name),
            )
            .slice(0, 4),
        ),
      )
      .catch(() => setRelated([]));
  }, [collection.match, order]);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      <section className="relative grid min-h-[calc(100svh-88px)] lg:grid-cols-[1.05fr_1fr]">
        {/* Hoja: barre la pantalla de izquierda a derecha y deja el filo blanco del corte. */}
        <span
          aria-hidden="true"
          className="pay-blade pointer-events-none absolute inset-y-0 left-0 z-30 hidden w-3 bg-gradient-to-r from-black via-white to-black lg:block"
        />

        <div className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-10 lg:py-20 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <p className="pay-in font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
            Pago aprobado · Modo de prueba
            {orderCode && (
              <span className="text-accent"> · N° {orderCode}</span>
            )}
          </p>
          <h1 className="pay-in mt-4 font-condensed text-[clamp(3.5rem,9vw,8rem)] font-light uppercase leading-[0.9] [animation-delay:120ms]">
            Pedido
            <br />
            <span className="text-accent">confirmado</span>
          </h1>
          <p className="pay-in mt-6 max-w-md font-display text-sm text-white/70 sm:text-base [animation-delay:220ms]">
            Ya eres parte de Ruby. Este pago se hizo con una tarjeta de prueba
            de Stripe: no se movió dinero real.
          </p>

          <ol className="pay-in mt-10 space-y-4 [animation-delay:320ms]">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <div className="pay-in mt-10 [animation-delay:420ms]">
            <Link
              to={
                collection.slug
                  ? `/colecciones/${collection.slug}`
                  : "/catalogo"
              }
              className="btn-sweep inline-block bg-accent px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white [--sweep:rgb(0_0_0/0.25)]"
            >
              {collection.slug ? `Ver ${collection.title}` : "Seguir comprando"}
            </Link>
          </div>
        </div>

        {/* Panel rojo con la silueta del carrito y la boleta del pedido. */}
        <div className="pay-panel relative isolate flex items-center justify-center overflow-hidden bg-accent px-6 py-14 sm:px-10 lg:py-20">
          <img
            src={silhouette}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-70 mix-blend-multiply"
          />
          {order?.items?.length ? (
            <div className="pay-ticket relative w-full max-w-sm bg-[#0b0b0b] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                Tu pedido
              </p>
              <ul className="mt-4 divide-y divide-white/10">
                {order.items.map((item) => (
                  <li
                    key={`${item.productName}-${item.size}-${item.color}`}
                    className="flex items-center gap-4 py-3"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="h-16 w-12 shrink-0 bg-[#141414] object-contain p-1"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-condensed text-xl font-light uppercase leading-tight">
                        {item.productName}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                        {item.size} / {item.color} · x{item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-xs">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-end justify-between border-t border-white/20 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Total pagado
                </span>
                <span className="font-condensed text-4xl leading-none">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ) : (
            <p className="pay-ticket font-script text-6xl leading-tight text-white">
              Gracias.
            </p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 pb-20 pt-16 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
              Completa el look
            </p>
            <h2 className="mt-3 font-condensed text-5xl font-light uppercase leading-none sm:text-6xl">
              Más de {collection.title}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {related.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Pago cancelado: el carrito se conserva para reintentar.
function Cancelled() {
  const { open } = useCart();
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20 text-white sm:px-10">
      <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
        Pago cancelado
      </p>
      <h1 className="animate-fade-up mt-4 font-condensed text-[clamp(3.5rem,10vw,8rem)] font-light uppercase leading-[0.9] [animation-delay:80ms]">
        No se cobró <span className="text-accent">nada</span>
      </h1>
      <p className="animate-fade-up mt-6 max-w-md font-display text-sm text-white/70 sm:text-base [animation-delay:160ms]">
        Cancelaste el pago. Tu carrito sigue como lo dejaste, así que puedes
        volver a intentarlo cuando quieras.
      </p>
      <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
        <button
          type="button"
          onClick={open}
          className="btn-sweep bg-accent px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white [--sweep:rgb(0_0_0/0.25)]"
        >
          Volver al carrito
        </button>
        <Link
          to="/catalogo"
          className="border border-white/50 px-8 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
        >
          Ver tienda
        </Link>
      </div>
    </section>
  );
}

// Página a la que Stripe devuelve al cliente. Con `success` el pago se completó (el stock y el estado del pedido
// los confirma el webhook del backend) y se vacía el carrito; si no, el cliente canceló.
function PaymentResult({ success }) {
  const { clear } = useCart();

  useEffect(() => {
    if (success) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return success ? <Confirmed /> : <Cancelled />;
}

export default PaymentResult;
