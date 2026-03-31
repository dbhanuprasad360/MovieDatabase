import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

// TMDB's highest known movie id is around 1000000
// but valid movies are scattered — we try random ids until one works
const MAX_MOVIE_ID = 900000;

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
];

// ── RANDOM TRAILER SECTION ──
function RandomTrailer() {
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchRandomTrailer() {
    setLoading(true);
    setTrailer(null);
    setMovie(null);

    // keep trying random ids until we find one with a trailer
    let found = false;
    while (!found) {
      const randomId = Math.floor(Math.random() * MAX_MOVIE_ID) + 1;
      try {
        const [movieRes, videoRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${randomId}/videos?api_key=${API_KEY}`,
          ),
        ]);

        const videos = videoRes.data.results;
        const trailer = videos.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );

        if (trailer && movieRes.data.title) {
          setMovie(movieRes.data);
          setTrailer(trailer.key);
          found = true;
        }
      } catch {
        // id doesn't exist, try another
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-4">
          We'll pick a completely random movie from TMDB and play its trailer!
        </p>
        <button
          onClick={fetchRandomTrailer}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600
          hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl
          transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "🎲 Finding a movie..." : "🎬 Random Trailer!"}
        </button>
      </div>

      {/* MOVIE INFO + TRAILER */}
      {movie && (
        <div className="flex flex-col gap-4">
          {/* movie info bar */}
          <div
            className="flex items-center gap-4 bg-white/5 border border-white/10
            rounded-xl p-4"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : "https://via.placeholder.com/60x90?text=?"
              }
              alt={movie.title}
              className="w-12 h-18 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">{movie.title}</h3>
              <div className="flex gap-4 text-xs text-gray-400 mt-1">
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span>📅 {movie.release_date?.slice(0, 4)}</span>
                <span>🕐 {movie.runtime} min</span>
              </div>
            </div>
            <Link
              to={`/movie/${movie.id}`}
              className="bg-green-500/10 border border-green-500/30 text-green-400
              text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              View Details →
            </Link>
          </div>

          {/* trailer */}
          {/* trailer */}
          <div className="w-full flex justify-center">
            <div className="w-[70vw] aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0`}
                title="Random Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RANDOM MOVIE/SHOW SECTION ──
function RandomPick() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("movie");

  async function fetchRandom() {
    setLoading(true);
    setResult(null);

    let found = false;
    while (!found) {
      const randomId = Math.floor(Math.random() * MAX_MOVIE_ID) + 1;
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${randomId}?api_key=${API_KEY}`,
        );
        const item = res.data;
        // make sure it has a poster and a title/name
        if (item.poster_path && (item.title || item.name)) {
          setResult(item);
          found = true;
        }
      } catch {
        // id doesn't exist, try another
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* type toggle */}
      <div className="flex justify-center gap-3">
        {["movie", "tv"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setMediaType(type);
              setResult(null);
            }}
            className={`px-6 py-2 rounded-lg text-sm font-medium border transition-all
              ${
                mediaType === type
                  ? "bg-green-500 text-white border-green-500"
                  : "border-white/20 text-gray-400 hover:border-green-500/40 hover:text-white"
              }`}
          >
            {type === "movie" ? "🎬 Movie" : "📺 TV Show"}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={fetchRandom}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-600
          text-white font-semibold px-8 py-3 rounded-xl transition-all
          shadow-[0_0_20px_rgba(34,197,94,0.3)]
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "🎲 Searching..." : "🎲 Surprise Me!"}
        </button>
      </div>

      {result && (
        <div className="flex gap-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <img
            src={`https://image.tmdb.org/t/p/w342${result.poster_path}`}
            alt={result.title || result.name}
            className="w-36 h-52 object-cover rounded-xl flex-shrink-0 shadow-xl"
          />
          <div className="flex flex-col gap-3">
            <h2 className="text-white text-2xl font-bold">
              {result.title || result.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs bg-white/10 border border-white/20
                  px-3 py-1 rounded-full text-gray-300"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>⭐ {result.vote_average?.toFixed(1)}</span>
              {result.runtime && <span>🕐 {result.runtime} min</span>}
              {result.number_of_seasons && (
                <span>📺 {result.number_of_seasons} seasons</span>
              )}
              <span>
                📅 {(result.release_date || result.first_air_date)?.slice(0, 4)}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {result.overview}
            </p>
            <Link
              to={`/${mediaType === "movie" ? "movie" : "tv"}/${result.id}`}
              className="self-start bg-green-500 hover:bg-green-600 text-white
              text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors mt-2"
            >
              View Details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SPIN THE WHEEL SECTION ──
// Drop-in replacement for the SpinWheel component in Fun.jsx
// Changes:
//   • Desktop: after first spin, wheel locks to the left and results panel
//              stays mounted on the right for ALL subsequent spins
//   • Re-spin: previous cards stay visible (dimmed) while wheel is spinning
//              and while new movies are fetching — no blank-panel flash ever
//   • Cards + genre header only swap once the NEW fetch resolves
//   • Mobile:  results show below the wheel with bigger cards (2-col grid)
//
// tailwind.config.js — add these to theme.extend:
//   keyframes: {
//     'fade-in':  { from: { opacity: '0', transform: 'translateX(12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
//     'shimmer':  { '0%,100%': { transform: 'translateX(-200%)' }, '50%': { transform: 'translateX(200%)' } },
//   },
//   animation: {
//     'fade-in': 'fade-in 0.4s ease-out forwards',
//     'shimmer': 'shimmer 1s ease-in-out infinite',
//   },

function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // "displayed" state — what's visible in the right panel right now
  const [displayGenre, setDisplayGenre] = useState(null);
  const [displayMovies, setDisplayMovies] = useState([]);

  // true only while the NEW batch of movies is fetching (after wheel stops)
  const [refreshing, setRefreshing] = useState(false);

  const segmentAngle = 360 / GENRES.length;

  function spin() {
    if (spinning) return;
    setSpinning(true);
    // ← do NOT clear displayGenre / displayMovies here
    //   previous cards stay visible while the wheel spins

    const extraSpins = 1440 + Math.random() * 1440;
    const newRotation = rotation + extraSpins;
    setRotation(newRotation);

    setTimeout(() => {
      const normalized = newRotation % 360;

      // pointer is at top → adjust by 270deg
      const pointerAngle = (360 - normalized + 360) % 360;

      const index = Math.floor(pointerAngle / segmentAngle) % GENRES.length;

      const genre = GENRES[index];
      setSpinning(false);
      fetchGenreMovies(genre); // pass full genre object
    }, 4000);
  }

  async function fetchGenreMovies(genre) {
    setRefreshing(true);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=trending.desc`,
      );
      // only NOW swap out what's shown — no empty-panel flash
      setDisplayGenre(genre);
      setDisplayMovies(res.data.results.slice(0, 6));
    } catch (err) {
      console.log(err);
    }
    setRefreshing(false);
  }

  const conicGradient = GENRES.map((_, i) => {
    const colors = [
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
      "#052e16",
      "#166534",
      "#15803d",
    ];
    const start = i * segmentAngle;
    const end = (i + 1) * segmentAngle;
    return `${colors[i % colors.length]} ${start}deg ${end}deg`;
  }).join(", ");

  // The panel stays visible as long as we've ever had a result
  const hasResult = !!displayGenre;

  return (
    /*
     * Outer wrapper
     * On desktop (md+): flex-row once we have a result, stays that way forever
     * On mobile:        flex-col, results below
     */
    <div
      className={`
        flex flex-col items-center gap-8
        md:items-start md:gap-0
        ${hasResult ? "md:flex-row md:items-center" : ""}
        transition-all duration-500
      `}
    >
      {/* ── LEFT COLUMN: wheel + spin button ── */}
      <div
        className={`
          flex flex-col items-center gap-6
          transition-all duration-500
          ${hasResult ? "md:w-auto md:pr-10" : "w-full"}
        `}
      >
        {/* pointer */}
        <div className="relative">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10
              w-0 h-0
              border-l-[10px] border-r-[10px] border-t-[20px]
              border-l-transparent border-r-transparent border-t-green-400
              drop-shadow-[0_0_6px_#22c55e]"
          />

          {/* wheel */}
          <div
            className="w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-green-500
              shadow-[0_0_30px_rgba(34,197,94,0.4)] relative overflow-hidden"
            style={{
              background: `conic-gradient(${conicGradient})`,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17,0.67,0.12,0.99)"
                : "none",
            }}
          >
            {GENRES.map((genre, i) => {
              const angle = i * segmentAngle + segmentAngle / 2;
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 50 + 32 * Math.cos(rad);
              const y = 50 + 32 * Math.sin(rad);
              return (
                <span
                  key={genre.id}
                  className="absolute text-white text-[13px] font-bold"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {genre.name}
                </span>
              );
            })}

            {/* center dot */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-8 h-8 bg-green-400 rounded-full shadow-lg z-10"
            />
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="bg-gradient-to-r from-green-500 to-green-600
            text-white font-semibold px-10 py-3 rounded-xl transition-all
            shadow-[0_0_20px_rgba(34,197,94,0.3)] text-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {spinning ? "Spinning..." : "🎡 Spin!"}
        </button>
      </div>

      {/* ── RIGHT COLUMN (desktop) / BELOW (mobile): results ── */}
      {hasResult && (
        <div
          className="
            w-full
            md:flex-1 md:border-l md:border-white/10 md:pl-10
            animate-fade-in
          "
        >
          {/* header — dims while spinning/refreshing so user knows something's happening */}
          <div
            className={`mb-5 transition-opacity duration-300 ${spinning || refreshing ? "opacity-40" : "opacity-100"}`}
          >
            <p className="text-green-400 text-lg font-bold">
              🎬 You got: {displayGenre.name}!
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Top {displayGenre.name} picks for you
            </p>
          </div>

          {/*
           * Cards stay mounted the whole time.
           * While refreshing, a subtle pulse overlay dims them — no blank state.
           * Desktop: 3-column grid | Mobile: 2-column grid with bigger cards
           */}
          <div
            className={`relative transition-opacity duration-300 ${refreshing ? "opacity-40" : "opacity-100"}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-5">
              {displayMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="flex flex-col items-center group"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                        : "https://via.placeholder.com/112x168?text=?"
                    }
                    alt={movie.title}
                    className="w-36 h-52 md:w-full md:h-auto md:aspect-[2/3] object-cover
                      rounded-xl border border-white/10
                      group-hover:border-green-500/40 group-hover:scale-[1.03]
                      transition-all shadow-lg"
                  />
                  <p
                    className="text-xs text-gray-400 mt-2 text-center leading-tight
                      group-hover:text-white transition-colors line-clamp-2 px-1"
                  >
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>

            {/* thin "loading new results" bar at the top of the panel */}
            {refreshing && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500/30 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-green-400 rounded-full animate-[shimmer_1s_ease-in-out_infinite]" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN FUN PAGE ──
function Fun() {
  const [activeTab, setActiveTab] = useState("trailer");

  const tabs = [
    { id: "trailer", label: "🎬 Random Trailer" },
    { id: "pick", label: "🎲 Random Pick" },
    { id: "wheel", label: "🎡 Spin the Wheel" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="bg-gradient-to-b from-green-950/30 to-transparent py-4 px-8">
        <h1
          className="text-5xl font-black tracking-[4px] text-white "
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          FUN <span className="text-green-400">ZONE</span>
        </h1>
        <p className="text-gray-400">Discover something new — randomly!</p>
      </div>
      <div className="px-8">
        {/* TABS */}
        <div className="flex gap-3 mb-4 justify-center border-b border-white/[0.06] pb-2">
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

        {/* CONTENT */}
        <div className=" w-full pb-20">
          {activeTab === "trailer" && <RandomTrailer />}
          {activeTab === "pick" && <RandomPick />}
          {activeTab === "wheel" && <SpinWheel />}
        </div>
      </div>
    </div>
  );
}

export default Fun;
