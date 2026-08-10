import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow h-16 flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div className="font-semibold">
        Welcome, {user?.name}
      </div>

    </div>
  );
}

export default Navbar;