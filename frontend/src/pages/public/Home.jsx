import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">ODDI.</h1>
      <p className="mt-4 text-gray-600">Streetwear con flow propio.</p>
      <Link
        to="/catalogo"
        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
      >
        Ver catálogo
      </Link>
    </section>
  );
}

export default Home;
