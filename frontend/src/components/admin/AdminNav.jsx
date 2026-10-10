import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNav() {
  const { logout } = useAuth();

  return (
    <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
      <nav className="flex gap-4 text-sm">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Productos</Link>
      </nav>
      <button type="button" onClick={logout} className="text-sm text-gray-500 underline">
        Cerrar sesión
      </button>
    </div>
  );
}

export default AdminNav;
