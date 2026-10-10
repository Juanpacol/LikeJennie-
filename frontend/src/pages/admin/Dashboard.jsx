import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { logout } = useAuth();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button type="button" onClick={logout} className="text-sm text-gray-500 underline">
          Cerrar sesión
        </button>
      </div>
      <p className="mt-2 text-gray-500">Próximamente: métricas, stock bajo y CRUD de productos.</p>
    </section>
  );
}

export default Dashboard;
