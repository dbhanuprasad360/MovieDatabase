import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#08080c] border-t border-white/[0.06] ">
      <div className="max-w-6xl mx-auto  py-5">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* LOGO + TAGLINE */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600
                rounded-lg flex items-center justify-center text-sm
                shadow-[0_0_12px_rgba(34,197,94,0.3)]"
              >
                🎬
              </div>
              <span
                className="text-white font-black text-xl tracking-[3px]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                CINE<span className="text-green-400">DB</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Your ultimate destination for movies, TV shows and the people
              behind them. Powered by TMDB.
            </p>
            {/* TMDB attribution — required by their API terms */}
            <div className="flex items-center gap-2 mt-2">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB"
                className="h-4 opacity-50"
              />
              <span className="text-gray-600 text-xs">
                Data provided by TMDB
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
              Explore
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { to: "/movies", label: "Movies" },
                { to: "/tvshow", label: "TV Shows" },
                { to: "/Actors", label: "Actors" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-gray-500 text-sm hover:text-green-400 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ACCOUNT LINKS */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
              Account
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { to: "/login", label: "Login" },
                { to: "/signup", label: "Sign Up" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-gray-500 text-sm hover:text-green-400 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div
          className="border-t border-white/[0.06] mt-5 pt-6 flex flex-col md:flex-row
          justify-between items-center gap-3"
        >
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} CineDB. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Built with React + Vite + Tailwind + TMDB API
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
