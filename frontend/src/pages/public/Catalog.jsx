import StoreGrid from "../../components/product/StoreGrid";

// Página del catálogo: etiqueta en monoespaciada y título enorme en condensada, como el hero de la home.
function Catalog() {
  return (
    <div className="bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-14 sm:px-10">
        <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
          Tienda · Ruby. 2026
        </p>
        <h1 className="animate-fade-up mt-4 font-condensed text-[clamp(4.5rem,13vw,11rem)] font-light uppercase leading-[0.9] tracking-[-0.02em] [animation-delay:80ms]">
          Catálogo
        </h1>
        <StoreGrid />
      </section>
    </div>
  );
}

export default Catalog;
