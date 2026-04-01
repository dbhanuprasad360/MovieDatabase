import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MovieContext } from "./MovieContext";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(MovieContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // useLocation tells us the current URL so we can highlight the active link

  function handleLogout() {
    setIsLoggedIn(false);
    navigate("/login");
  }

  const links = [
    { to: "/movies", label: "Movies" },
    { to: "/tvshow", label: "TV Shows" },
    { to: "/Actors", label: "Actors" },
    { to: "/fun", label: "Fun Zone" },
    // { to: "/watchlist", label: "Watchlist" },
    // { to: "/recommend", label: "Recommendations" },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[62px] z-20
      flex items-center px-5 gap-0
      bg-[#08080c]/92 backdrop-blur-xl
      border-b border-white/[0.06]"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg, transparent, transparent 2px,
          rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px
        )`,
      }}
    >
      {/* left green accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]
        bg-gradient-to-b from-transparent via-green-500 to-transparent"
      />

      {/* CENTER LINKS */}
      <nav className="flex-1 flex  gap-1">
        {/* BRAND */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 mr-8 pl-[54px]"
        >
          <div
            className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600
    rounded-lg flex items-center justify-center text-sm
    shadow-[0_0_12px_rgba(34,197,94,0.3)]"
          >
            🎬
          </div>
          <span
            className="text-white font-black text-2xl tracking-[3px] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            CINE<span className="text-green-400">DB</span>
          </span>
        </Link>

        {links.map(({ to, label }) => {
          // check if this link is active
          const isActive =
            location.pathname === to ||
            (to === "/movies" && location.pathname.startsWith("/movie/")) ||
            (to === "/tvshow" && location.pathname.startsWith("/tv/")) ||
            (to === "/Actors" && location.pathname.startsWith("/person/"));
          return (
            <Link
              key={to}
              to={to}
              className={`relative px-3.5 py-1.5 text-[18px] font-medium
                rounded-md tracking-wide transition-colors duration-200
                group ${isActive ? "text-gray-100" : "text-gray-500 hover:text-gray-200"}`}
            >
              {label}

              {/* animated underline */}
              <span
                className={`absolute bottom-0 left-3.5 right-3.5 h-[2px]
                bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]
                transition-all duration-250 origin-center
                ${
                  isActive
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search — expands on focus */}
        <div
          className="flex items-center gap-2
          bg-white/[0.04] border border-white/[0.08] rounded-lg
          px-3 py-1.5 w-44 focus-within:w-56 focus-within:border-green-500/40
          focus-within:bg-white/[0.07] transition-all duration-300"
        >
          <span className="text-gray-600 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-200 text-xs w-full placeholder-gray-600"
          />
        </div>

        <div className="w-px h-4 bg-white/[0.07]" />

        {/* User section */}

        {isLoggedIn ? (
          <div className="relative flex items-center gap-2.5">
            {/* clicking the user info toggles dropdown */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setDropdownOpen((p) => !p)}
            >
              <div
                className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
        flex items-center justify-center text-white text-[11px] font-semibold
        border border-indigo-500/40"
              >
                JD
              </div>
              <div className="leading-tight">
                <div className="text-gray-200 text-xs font-medium">
                  John Doe
                </div>
                <div className="text-gray-600 text-[10px]">Member</div>
              </div>
              {/* arrow indicator */}
              <span
                className={`text-gray-500 text-xs transition-transform duration-200
        ${dropdownOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </div>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <>
                {/* invisible backdrop to close on outside click */}

                <div
                  className="absolute top-10 right-0 z-40 w-48
          bg-[#0f0f14] border border-white/[0.08] rounded-xl
          shadow-2xl overflow-hidden"
                >
                  {/* links */}
                  <div className="py-1">
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-400
              hover:text-white hover:bg-white/[0.05] transition-colors text-sm"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/watchlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-400
              hover:text-white hover:bg-white/[0.05] transition-colors text-sm"
                    >
                      Watchlist
                    </Link>
                    <Link
                      to="/recommend"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-400
              hover:text-white hover:bg-white/[0.05] transition-colors text-sm"
                    >
                      Recommendations
                    </Link>
                  </div>

                  {/* logout */}
                  <div className="border-t border-white/[0.06] py-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-400
              hover:text-red-300 hover:bg-red-500/[0.05] transition-colors
              text-sm w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative">
            <Link to="/login?type=user">
              <button
                className="text-green-400 text-xs font-medium border border-green-500/25
      bg-green-500/10 hover:bg-green-500/15 hover:border-green-500/50
      px-4 py-1.5 rounded-lg transition-all flex-shrink-0"
              >
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
