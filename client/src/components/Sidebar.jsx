import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="p-6 space-y-8">
      
      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold">
          DevBook
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Developer Social Platform
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-5 text-lg">

        <Link
          to="/"
          className="hover:text-zinc-400 transition"
        >
          🏠 Home
        </Link>

        <Link
          to="/search"
          className="hover:text-zinc-400 transition"
        >
          🔍 Explore
        </Link>

        <Link
          to="/saved"
          className="hover:text-zinc-400 transition"
        >
          📚 Saved
        </Link>

        {user && (
          <Link
            to={`/profile/${user._id}`}
            className="hover:text-zinc-400 transition"
          >
            👤 Profile
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="text-left hover:text-red-400 transition"
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;