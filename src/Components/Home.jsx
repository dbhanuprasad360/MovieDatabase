import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

// HERO — shows a random trending movie as background

function Hero({ movies }) {
  const [current, setCurrent] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerMode, setTrailerMode] = useState(true);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const timerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const upcomingMovies = movies;
  function goNext() {
    setCurrent((prev) => (prev + 1) % (upcomingMovies.length || 1));
  }

  useEffect(() => {
    if (!upcomingMovies.length || !trailerMode) return;
    const movie = upcomingMovies[current];
    if (!movie) return;

    setTrailerKey(null);
    setLoadingTrailer(true);

    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`,
      )
      .then((res) => {
        const trailer =
          res.data.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube",
          ) || res.data.results.find((v) => v.site === "YouTube");
        if (trailer) setTrailerKey(trailer.key);
        else setTimeout(goNext, 3000); // no trailer — skip after 3s
      })
      .catch(console.log)
      .finally(() => setLoadingTrailer(false));
  }, [current, trailerMode, upcomingMovies]);

  useEffect(() => {
    if (trailerMode || !upcomingMovies.length) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % upcomingMovies.length);
    }, 8000);
    return () => clearInterval(timerRef.current);
  }, [trailerMode, upcomingMovies]);

  if (!movies.length)
    return (
      <div
        className="w-full h-[70vh] bg-black animate-pulse flex items-center
      justify-center text-gray-700 text-sm"
      >
        Loading...
      </div>
    );

  if (!upcomingMovies.length)
    return (
      <div
        className="w-full h-[70vh] bg-black flex items-center
      justify-center text-gray-600 text-sm"
      >
        No upcoming movies found.
      </div>
    );

  const movie = upcomingMovies[current];
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div
      className="relative w-full h-[70vh] bg-cover bg-center transition-all duration-1000 overflow-hidden"
      style={{ backgroundImage: backdrop ? `url(${backdrop})` : "none" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <button
        onClick={() => setTrailerMode((p) => !p)}
        className={`absolute top-100 right-10 z-10 flex items-center gap-2
    bg-green-500 hover:bg-green-600 text-white text-sm
              font-semibold transition-colors px-4 py-2 rounded-full
    hover:border-white/40
    ${
      trailerMode
        ? "bg-red-600 hover:bg-red-500"
        : "bg-green-500 hover:bg-green-600"
    }`}
      >
        <span>{trailerMode ? "Pause" : "Play"}</span>
      </button>

      <div className="absolute inset-0 flex items-center">
        <div className="w-1/2 px-10 flex flex-col gap-4 z-10">
          <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
            🎬 Coming Soon
          </p>
          <h1 className="text-4xl font-black text-white leading-tight">
            {movie.title}
          </h1>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>📅 {movie.release_date}</span>
            {movie.vote_average > 0 && (
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            )}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
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
            <button
              onClick={goNext}
              className="bg-black/50 hover:bg-black/70 text-white text-sm
              px-4 py-2.5 rounded-lg border border-white/20 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="w-1/2 px-8 z-10">
          {trailerMode ? (
            <div
              className="w-full aspect-video rounded-xl overflow-hidden
              shadow-[0_0_40px_rgba(0,0,0,0.8)] border-1 border-white/20"
            >
              {loadingTrailer ? (
                <div
                  className="w-full h-full bg-black/50 flex items-center
                  justify-center text-gray-500 animate-pulse text-sm"
                >
                  Loading trailer...
                </div>
              ) : trailerKey ? (
                <iframe
                  key={trailerKey}
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
                  allowFullScreen
                  className="w-full h-full"
                  ref={(el) => {
                    if (el) {
                      clearTimeout(timerRef.current);
                      timerRef.current = setTimeout(goNext, 150000);
                    }
                  }}
                />
              ) : (
                <div
                  className="w-full h-full bg-black/50 flex flex-col
                  items-center justify-center gap-2 text-gray-500"
                >
                  <span className="text-3xl">🎬</span>
                  <span className="text-sm">No trailer available</span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full aspect-video rounded-xl overflow-hidden
              shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10"
            >
              <img
                src={
                  backdrop ||
                  "https://via.placeholder.com/640x360?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-10 flex gap-2 z-20">
        {upcomingMovies.map((_, i) => (
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

  // replace in Home()
  const [upcomingRaw, setUpcomingRaw] = useState([]);

  // useEffect(() => {
  //   const today = new Date().toISOString().slice(0, 10);
  //   // 3 months from now
  //   const threeMonthsLater = new Date();
  //   threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 7);
  //   const future = threeMonthsLater.toISOString().slice(0, 10);

  //   axios
  //     .get(
  //       `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${today}&primary_release_date.lte=${future}&sort_by=release_date.asc&with_original_language=en&vote_count.gte=3`,
  //     )
  //     .then((res) => {
  //       const movies = (res.data.results || [])
  //         .filter((m) => m.backdrop_path && m.poster_path && m.overview)
  //         // ↑ only movies with images and overview — quality filter
  //         .slice(0, 5);
  //       setUpcomingRaw(movies);
  //       console.log(today);
  //       console.log(future);
  //       console.log(movies);
  //     })
  //     .catch(console.log);
  // }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    const baseUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`;

    Promise.all([
      axios.get(`${baseUrl}&page=1`),
      axios.get(`${baseUrl}&page=2`),
      axios.get(`${baseUrl}&page=3`),
      axios.get(`${baseUrl}&page=4`),
      axios.get(`${baseUrl}&page=5`),
      axios.get(`${baseUrl}&page=6`),
      axios.get(`${baseUrl}&page=7`),
      axios.get(`${baseUrl}&page=8`),
      axios.get(`${baseUrl}&page=9`),
      axios.get(`${baseUrl}&page=10`),
    ])
      .then((responses) => {
        const allMovies = responses.flatMap((res) => res.data.results || []);
        console.log("Total:", allMovies.length, "movies fetched");

        const filtered = allMovies
          .filter((m) => m.release_date && m.release_date >= today)
          .filter((m) => m.backdrop_path && m.poster_path && m.overview)
          .filter((m) => m.popularity > 10)
          .filter((m, i, self) => self.findIndex((x) => x.id === m.id) === i)
          .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
          .slice(0, 5);

        setUpcomingRaw(filtered);
      })
      .catch(console.log);
  }, []);

  return (
    <div className="min-h-screen bg-black ">
      {/* HERO */}
      <Hero movies={upcomingRaw} />

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
