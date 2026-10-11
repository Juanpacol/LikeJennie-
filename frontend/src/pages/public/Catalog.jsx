import StoreGrid from "../../components/product/StoreGrid";

function Catalog() {
  return (
    <div className="bg-black">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl text-white">Catálogo</h1>
        <StoreGrid />
      </section>
    </div>
  );
}

export default Catalog;
