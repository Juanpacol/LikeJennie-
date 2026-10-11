import StoreGrid from "../../components/product/StoreGrid";
import storeImage1 from "../../assets/jennie-store-1.jpg";
import storeImage2 from "../../assets/jennie-store-2.jpg";

function Catalog() {
  return (
    <div className="bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <img src={storeImage1} alt="Ruby." className="h-64 w-full object-cover sm:h-80" />
        <img src={storeImage2} alt="Ruby." className="h-64 w-full object-cover sm:h-80" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl text-white">Catálogo</h1>
        <StoreGrid />
      </section>
    </div>
  );
}

export default Catalog;
