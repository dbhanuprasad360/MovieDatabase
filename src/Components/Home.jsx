import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

// HERO — shows a random trending movie as background
function Hero({ movies }) {
  const [current, setCurrent] = useState(0);

  // auto rotate every 5 seconds
  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[current];
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div
      className="relative w-full h-[70vh]  bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: backdrop ? `url(${backdrop})` : "none" }}
    >
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* content */}
      <div className="absolute bottom-16 left-8 max-w-lg">
        <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-2">
          Trending Now
        </p>
        <h1 className="text-4xl font-black text-white mb-3 leading-tight">
          {movie.title || movie.name}
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <Link
            to={`/movie/${movie.id}`}
            className="bg-green-500 hover:bg-green-600 text-white text-sm
            font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <span
            className="flex items-center gap-1 text-yellow-400 text-sm
            bg-black/40 px-4 py-2.5 rounded-lg border border-white/10"
          >
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>

      {/* dot indicators */}
      <div className="absolute bottom-6 left-8 flex gap-2">
        {Array.from({ length: Math.min(movies.length, 5) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-300
              ${i === current ? "w-6 bg-green-400" : "w-2 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

// reusable hook for fetching a single endpoint
function useFetch(endpoint) {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}`)
      .then((res) => setData(res.data.results || []))
      .catch((err) => console.log(err));
  }, [endpoint]);
  return data;
}

// horizontal scrollable row component
function Row({ title, items, type }) {
  const rowRef = useRef(null);

  function scrollLeft() {
    rowRef.current.scrollBy({ left: -400, behavior: "smooth" });
  }

  function scrollRight() {
    rowRef.current.scrollBy({ left: 400, behavior: "smooth" });
  }

  function getLink(item) {
    if (type === "person") return `/person/${item.id}`;
    if (type === "tv") return `/tv/${item.id}`;
    return `/movie/${item.id}`;
  }

  function getImage(item) {
    if (type === "person") {
      return item.profile_path
        ? `https://image.tmdb.org/t/p/w342${item.profile_path}`
        : "https://via.placeholder.com/150x225?text=?";
    }
    return item.poster_path
      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
      : "https://via.placeholder.com/150x225?text=?";
  }

  function getLabel(item) {
    return item.title || item.name || "Unknown";
  }

  function getStat(item) {
    if (type === "person") return `🔥 ${item.popularity?.toFixed(1)}`;
    return `⭐ ${item.vote_average?.toFixed(1)}`;
  }

  return (
    <div className="  pb-10">
      {/* ROW HEADER */}
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-500/30
            border border-white/10 hover:border-green-500/40
            text-white text-sm transition-all flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-500/30
            border border-white/10 hover:border-green-500/40
            text-white text-sm transition-all flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>

      {/* SCROLLABLE ROW */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            to={getLink(item)}
            className="flex-shrink-0 w-44 group"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={getImage(item)}
                alt={getLabel(item)}
                className="w-44 h-64 object-cover rounded-lg
                group-hover:scale-105 transition duration-300"
              />
              {/* hover overlay */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                transition duration-300 rounded-lg flex items-end"
              >
                <div
                  className="p-2 translate-y-full group-hover:translate-y-0
                  transition duration-300 w-full"
                >
                  <span className="text-xs text-green-400 font-medium">
                    {getStat(item)}
                  </span>
                </div>
              </div>
            </div>
            {/* label */}
            <p
              className="text-xs text-gray-400 mt-2 leading-tight
              group-hover:text-white transition-colors line-clamp-2"
            >
              {getLabel(item)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// MAIN HOME COMPONENT
function Home() {
  const trendingMovies = useFetch("trending/movie/day");
  const trendingShows = useFetch("trending/tv/day");
  const popularPeople = useFetch("person/popular");
  const topRatedMovies = useFetch("movie/top_rated");
  const topRatedShows = useFetch("tv/top_rated");

  return (
    <div className="min-h-screen bg-black ">
      {/* HERO */}
      <Hero movies={trendingMovies} />

      {/* ROWS */}
      <div className="mt-8">
        <Row title="🔥 Trending Movies" items={trendingMovies} type="movie" />
        <Row title="🔥 Trending TV Shows" items={trendingShows} type="tv" />
        <Row title="⭐ Trending Actors" items={popularPeople} type="person" />
        <Row title="🏆 Top Rated Movies" items={topRatedMovies} type="movie" />
        <Row title="🏆 Top Rated Shows" items={topRatedShows} type="tv" />
      </div>
    </div>
  );
}

export default Home;
