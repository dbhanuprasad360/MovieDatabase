import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MovieContext } from "./MovieContext";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

// fake users list for demo
const FAKE_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    watchlist: 12,
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@email.com",
    watchlist: 8,
    joined: "2024-02-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@email.com",
    watchlist: 23,
    joined: "2024-03-05",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@email.com",
    watchlist: 5,
    joined: "2024-04-12",
  },
];

function AdminDashboard() {
  const { isAdmin, watchList, handleDelete } = useContext(MovieContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [genreStats, setGenreStats] = useState([]);
  const [trendingStats, setTrendingStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // redirect if not admin
  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin]);

  // fetch genre popularity stats
  useEffect(() => {
    if (activeTab !== "stats") return;
    setLoadingStats(true);

    const genreIds = [
      { id: 28, name: "Action" },
      { id: 35, name: "Comedy" },
      { id: 18, name: "Drama" },
      { id: 27, name: "Horror" },
      { id: 878, name: "Sci-Fi" },
      { id: 10749, name: "Romance" },
      { id: 53, name: "Thriller" },
      { id: 16, name: "Animation" },
    ];

    // fetch top movie for each genre to get popularity score
    Promise.all(
      genreIds.map((g) =>
        axios
          .get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${g.id}&sort_by=popularity.desc`,
          )
          .then((res) => ({
            genre: g.name,
            popularity: Math.round(res.data.results[0]?.popularity || 0),
            count: res.data.total_results,
          })),
      ),
    )
      .then((results) => {
        // sort by popularity
        setGenreStats(results.sort((a, b) => b.popularity - a.popularity));
      })
      .catch(console.log)
      .finally(() => setLoadingStats(false));
  }, [activeTab]);

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "watchlist", label: "❤️ Watchlists" },
    { id: "users", label: "👥 Users" },
    { id: "stats", label: "📈 Statistics" },
  ];

  const maxPopularity = Math.max(...genreStats.map((g) => g.popularity), 1);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div
        className="bg-gradient-to-r from-green-950/40 to-transparent
        border-b border-white/[0.06] px-8 py-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🔐</span>
          <h1
            className="text-3xl font-black tracking-wider"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ADMIN <span className="text-green-400">DASHBOARD</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">Manage your CineDB application</p>
      </div>

      <div className="px-8 py-6">
        {/* TABS */}
        <div className="flex gap-2 mb-8 border-b border-white/[0.06] pb-4 flex-wrap">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all
                ${
                  activeTab === id
                    ? "bg-green-500 text-white border-green-500"
                    : "border-white/20 text-gray-400 hover:border-green-500/40 hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Users",
                  value: FAKE_USERS.length,
                  icon: "👥",
                  color: "from-blue-500/20 to-blue-600/10",
                },
                {
                  label: "Watchlist Items",
                  value: watchList.length,
                  icon: "❤️",
                  color: "from-red-500/20 to-red-600/10",
                },
                {
                  label: "Movies",
                  value: watchList.filter((m) => m.title).length,
                  icon: "🎬",
                  color: "from-green-500/20 to-green-600/10",
                },
                {
                  label: "TV Shows",
                  value: watchList.filter((m) => m.name).length,
                  icon: "📺",
                  color: "from-purple-500/20 to-purple-600/10",
                },
              ].map(({ label, value, icon, color }) => (
                <div
                  key={label}
                  className={`bg-gradient-to-br ${color} border border-white/[0.08]
                  rounded-xl p-5 flex flex-col gap-2`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="text-3xl font-black text-white">{value}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>

            {/* RECENT WATCHLIST */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">
                Recently Added to Watchlist
              </h2>
              {watchList.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No items in watchlist yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {watchList
                    .slice(-6)
                    .reverse()
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={item.title ? `/movie/${item.id}` : `/tv/${item.id}`}
                        className="flex items-center gap-3 bg-white/[0.04] border
                      border-white/[0.08] hover:border-green-500/30 rounded-lg p-2
                      transition-all group"
                      >
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                              : "https://via.placeholder.com/40x60?text=?"
                          }
                          alt={item.title || item.name}
                          className="w-8 h-12 object-cover rounded"
                        />
                        <span
                          className="text-xs text-gray-400 group-hover:text-white
                        transition-colors max-w-[100px] line-clamp-2"
                        >
                          {item.title || item.name}
                        </span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WATCHLIST TAB */}
        {activeTab === "watchlist" && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex justify-between items-center">
              <h2 className="font-bold text-lg">
                All Watchlist Items ({watchList.length})
              </h2>
            </div>
            {watchList.length === 0 ? (
              <p className="text-gray-500 text-sm p-6">Watchlist is empty</p>
            ) : (
              <table className="w-full">
                <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Item</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Rating</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {watchList.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                : "https://via.placeholder.com/40x60?text=?"
                            }
                            alt={item.title || item.name}
                            className="w-8 h-12 object-cover rounded"
                          />
                          <span className="text-sm text-gray-300">
                            {item.title || item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border
                          ${
                            item.title
                              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                              : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                          }`}
                        >
                          {item.title ? "Movie" : "TV Show"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-400">
                        ⭐ {item.vote_average?.toFixed(1)}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {item.release_date || item.first_air_date || "N/A"}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs text-red-400 border border-red-500/25
                          bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-lg
                          transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08]">
              <h2 className="font-bold text-lg">
                Registered Users ({FAKE_USERS.length})
              </h2>
            </div>
            <table className="w-full">
              <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Watchlist</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {FAKE_USERS.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br
                          from-indigo-500 to-purple-600 flex items-center justify-center
                          text-white text-xs font-bold"
                        >
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-300">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {user.watchlist} items
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {user.joined}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full
                        bg-green-500/10 border border-green-500/30 text-green-400"
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-6">
                Genre Popularity on TMDB
              </h2>

              {loadingStats ? (
                <div className="text-center text-white animate-pulse py-8">
                  Loading stats...
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {genreStats.map((g) => (
                    <div key={g.genre} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-medium">
                          {g.genre}
                        </span>
                        <div className="flex gap-4 text-gray-500 text-xs">
                          <span>Popularity: {g.popularity}</span>
                          <span>{g.count.toLocaleString()} movies</span>
                        </div>
                      </div>
                      {/* BAR */}
                      <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400
                          rounded-full transition-all duration-700"
                          style={{
                            width: `${(g.popularity / maxPopularity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WATCHLIST BREAKDOWN */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-6">
                Your Watchlist Breakdown
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Movies",
                    value: watchList.filter((m) => m.title).length,
                    color: "bg-blue-500",
                  },
                  {
                    label: "TV Shows",
                    value: watchList.filter((m) => m.name).length,
                    color: "bg-purple-500",
                  },
                ].map(({ label, value, color }) => {
                  const total = watchList.length || 1;
                  const pct = Math.round((value / total) * 100);
                  return (
                    <div
                      key={label}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4"
                    >
                      <div className="text-3xl font-black text-white mb-1">
                        {value}
                      </div>
                      <div className="text-gray-400 text-sm mb-3">{label}</div>
                      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {pct}% of watchlist
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
