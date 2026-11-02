import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNav() {
  const { logout } = useAuth();

  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-200">
      <nav className="flex gap-2 text-sm">
        <Link to="/admin" className="py-3 pr-2">
          Dashboard
        </Link>
        <Link to="/admin/products" className="py-3 pr-2">
          Productos
        </Link>
      </nav>
      <button type="button" onClick={logout} className="py-3 text-sm text-gray-500 underline">
        Cerrar sesión
      </button>
    </div>
  );
}

export default AdminNav;
