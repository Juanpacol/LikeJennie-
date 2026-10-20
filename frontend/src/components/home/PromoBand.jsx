import { Link } from "react-router-dom";

// Banda promocional bajo el hero: lila de la paleta con llamado a la tienda.
function PromoBand() {
  return (
    <section className="bg-lilac px-6 py-16 text-center text-lilac-deep">
      <p className="font-display text-xs uppercase tracking-widest">Nueva colección</p>
      <h2 className="mt-3 font-script text-6xl leading-none sm:text-7xl">Fallen Angel</h2>
      <p className="mx-auto mt-4 max-w-md font-display text-sm">
        Hoodies, camisetas y accesorios con el flow de Ruby.
      </p>
      <Link
        to="/colecciones/fallen-angel"
        className="mt-8 inline-block bg-lilac-deep px-8 py-3 font-display text-xs uppercase tracking-widest text-white transition hover:bg-black"
      >
        Comprar ahora
      </Link>
    </section>
  );
}

export default PromoBand;
