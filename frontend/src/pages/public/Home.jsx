import JennieHero from "../../components/home/JennieHero";
import StoreGrid from "../../components/product/StoreGrid";

function Home() {
  return (
    <>
      <JennieHero />

      <section id="tienda" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Tienda
        </h2>
        <StoreGrid />
      </section>
    </>
  );
}

export default Home;
