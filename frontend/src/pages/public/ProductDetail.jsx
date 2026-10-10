import { useParams } from "react-router-dom";

function ProductDetail() {
  const { slug } = useParams();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Detalle: {slug}</h1>
      <p className="mt-2 text-gray-500">Próximamente: specs, selector de variante y carrito.</p>
    </section>
  );
}

export default ProductDetail;
