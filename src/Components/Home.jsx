import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

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
    rowRef.current.scrollBy({ left: -1000, behavior: "smooth" });
  }

  function scrollRight() {
    rowRef.current.scrollBy({ left: 1000, behavior: "smooth" });
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
    <div className="pb-10">
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

  // replace in Home()

  return (
    <div className="min-h-screen bg-black ">
      <Banner />

      {/* ROWS */}
      <div className="mt-8">
        <Row title="Trending Movies" items={trendingMovies} type="movie" />
        <Row title="Trending TV Shows" items={trendingShows} type="tv" />
        <Row title="Trending Actors" items={popularPeople} type="person" />
      </div>
    </div>
  );
}

export default Home;
