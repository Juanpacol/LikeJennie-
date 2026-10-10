import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDashboardSummary } from "../../services/dashboard.service";
import { formatPrice } from "../../utils/formatPrice";
import StatCard from "../../components/admin/StatCard";
import AdminNav from "../../components/admin/AdminNav";

function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary(token)
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <AdminNav />

      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {loading && <p className="mt-6 text-gray-500">Cargando métricas...</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}

      {summary && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Productos activos" value={summary.activeProductsCount} />
            <StatCard label="Variantes en alerta de stock" value={summary.lowStockCount} />
            <StatCard label="Órdenes totales" value={summary.ordersCount} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Alertas de stock</h2>
              {summary.lowStockVariants.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">Todo en orden.</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100">
                  {summary.lowStockVariants.map((variant) => (
                    <li key={variant.id} className="flex justify-between py-2 text-sm">
                      <span>
                        {variant.product.name} · {variant.size}/{variant.color}
                      </span>
                      <span
                        className={
                          variant.stock === 0
                            ? "font-medium text-red-600"
                            : "font-medium text-amber-600"
                        }
                      >
                        {variant.stock === 0 ? "Agotado" : `${variant.stock} u.`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold">Órdenes recientes</h2>
              {summary.recentOrders.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">Sin órdenes todavía.</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100">
                  {summary.recentOrders.map((order) => (
                    <li key={order.id} className="py-2 text-sm">
                      <div className="flex justify-between">
                        <span>{order.customerName}</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                      <span className="text-xs text-gray-400">{order.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;
