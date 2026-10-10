import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllProducts, deleteProduct } from "../../services/adminProduct.service";
import { formatPrice } from "../../utils/formatPrice";
import AdminNav from "../../components/admin/AdminNav";

function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    getAllProducts(token)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function confirmDelete(product) {
    setDeleteError(null);
    try {
      await deleteProduct(token, product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <AdminNav />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <Link
          to="/admin/products/new"
          className="rounded-full bg-black px-4 py-2 text-sm text-white"
        >
          + Nuevo producto
        </Link>
      </div>

      {loading && <p className="mt-6 text-gray-500">Cargando...</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}
      {deleteError && <p className="mt-6 text-red-600">{deleteError}</p>}

      {!loading && !error && (
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Nombre</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Stock total</th>
              <th className="py-2">Estado</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              const isPending = pendingDeleteId === product.id;

              return (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{product.category.name}</td>
                  <td className="py-2">{formatPrice(product.salePrice ?? product.basePrice)}</td>
                  <td className="py-2">{totalStock}</td>
                  <td className="py-2">{product.isActive ? "Activo" : "Inactivo"}</td>
                  <td className="py-2 text-right">
                    {isPending ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xs text-gray-500">¿Eliminar?</span>
                        <button
                          type="button"
                          onClick={() => confirmDelete(product)}
                          className="font-medium text-red-600 underline"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          className="underline"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <>
                        <Link to={`/admin/products/${product.id}/edit`} className="mr-3 underline">
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(product.id)}
                          className="text-red-600 underline"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Products;
