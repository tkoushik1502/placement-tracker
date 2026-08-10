import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaFileAlt,
  FaUser,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-72 bg-slate-900 text-white min-h-screen">

      <h1 className="text-2xl font-bold p-6 border-b border-slate-700">
        Placement Tracker
      </h1>

      <div className="flex flex-col mt-6">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/companies"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
        >
          <FaBuilding />
          Companies
        </Link>

        {/* Student Only */}
        {role === "student" && (
          <Link
            to="/applications"
            className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
          >
            <FaFileAlt />
            My Applications
          </Link>
        )}

        {/* Admin Only */}
        {role === "admin" && (
          <Link
            to="/students"
            className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
          >
            <FaUsers />
            Students
          </Link>
        )}

        <Link
          to="/profile"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
        >
          <FaUser />
          Profile
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-left hover:bg-red-600 mt-6"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;