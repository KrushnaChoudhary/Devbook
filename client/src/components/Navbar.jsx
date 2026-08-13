import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { logout, userToken } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-white"
      >
        DevBook
      </Link>

      {/* Navigation */}
      {userToken && (
        <div className="flex items-center gap-6 text-white">
          <Link to="/">Home</Link>

          <Link to="/search">Search</Link>

          <Link to="/saved">Saved</Link>

          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;