import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="w-full md:w-64 md:min-h-screen bg-slate-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-8 md:mb-10">
          Placement Tracker
        </h1>

        <nav className="flex flex-row md:flex-col flex-wrap gap-3 md:gap-4">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition"
          >
            Dashboard
          </Link>

          {/* Companies */}
          <Link
            to="/companies"
            className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition"
          >
            Companies
          </Link>

          {/* Admin Only */}
          {isAdmin && (
            <Link
              to="/students"
              className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition"
            >
              Students
            </Link>
          )}

          {/* Applications */}
          <Link
            to="/applications"
            className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition"
          >
            Applications
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition"
          >
            Profile
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-left px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
          >
            Logout
          </button>

        </nav>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;