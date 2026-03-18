import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "./MovieContext";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(MovieContext);
  const navigate = useNavigate();

  function handleLogout() {
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[58px] z-20
      bg-black/85 backdrop-blur-md border-b border-white/[0.07]
      flex items-center gap-4 px-5 pl-[66px]"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-sm">
          🎬
        </div>
        <span className="text-white font-black text-xl tracking-widest">
          CINE<span className="text-green-400">DB</span>
        </span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div
        className="flex items-center gap-2 bg-white/[0.06] border border-white/10
        rounded-full px-4 py-1.5 w-52 hover:border-green-500/40 transition-colors"
      >
        <span className="text-gray-500 text-xs">🔍</span>
        <input
          type="text"
          placeholder="Search movies, shows..."
          className="bg-transparent outline-none text-gray-200 text-sm w-full placeholder-gray-500"
        />
      </div>

      <div className="w-px h-5 bg-white/[0.08]" />

      {/* User section — swaps based on login state */}
      {isLoggedIn ? (
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
            flex items-center justify-center text-white text-xs font-semibold border-2 border-indigo-500/40"
          >
            JD
          </div>
          <div className="leading-tight">
            <div className="text-gray-200 text-sm font-medium">John Doe</div>
            <div className="text-gray-500 text-[11px]">Member</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 text-xs font-medium border border-red-500/25
            bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-full transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="text-green-400 text-xs font-medium border border-green-500/25
          bg-green-500/10 hover:bg-green-500/20 px-4 py-1.5 rounded-full transition-colors flex-shrink-0"
        >
          Login
        </Link>
      )}
    </div>
  );
}

export default Navbar;
