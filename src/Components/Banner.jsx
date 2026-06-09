import React from "react";
import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

function Hero({ movies }) {
  const [current, setCurrent] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerMode, setTrailerMode] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [noTrailer, setNoTrailer] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const intervalRef = useRef(null); // for setInterval (banner rotation)
  const timeoutRef = useRef(null); // for setTimeout (one-off delays)
  const iframeRef = useRef(null);

  const upcomingMovies = movies;

  // clear both timers safely
  function clearAllTimers() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function goNext() {
    clearAllTimers(); // ← clear everything before moving
    setNoTrailer(false);
    setCurrent((prev) => (prev + 1) % (upcomingMovies.length || 1));
  }

  // auto rotate in banner mode (no trailer)
  useEffect(() => {
    if (trailerMode || !upcomingMovies.length) return;

    clearAllTimers();
    intervalRef.current = setInterval(goNext, 10000);

    return () => clearAllTimers();
  }, [trailerMode, upcomingMovies, current]);
  // ↑ add current to deps so timer resets when current changes (manual click)

  // fetch trailer when in trailer mode
  useEffect(() => {
    if (!upcomingMovies.length || !trailerMode) return;
    const movie = upcomingMovies[current];
    if (!movie) return;

    clearAllTimers();
    setTrailerKey(null);
    setLoadingTrailer(true);
    setNoTrailer(false);

    axios
      .get(
        `https://api.themoviedb.org/3/${movie.mediaType}/${movie.id}/videos?api_key=${API_KEY}`,
      )
      .then((res) => {
        const trailer =
          res.data.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube",
          ) || res.data.results.find((v) => v.site === "YouTube");

        if (trailer) {
          setTrailerKey(trailer.key);
          // fallback auto-next after 2.5 min if trailer doesn't end
          timeoutRef.current = setTimeout(goNext, 150000);
        } else {
          setNoTrailer(true);
          timeoutRef.current = setTimeout(goNext, 5000);
        }
      })
      .catch(() => {
        setNoTrailer(true);
        timeoutRef.current = setTimeout(goNext, 5000);
      })
      .finally(() => setLoadingTrailer(false));
  }, [current, trailerMode, upcomingMovies]);

  // cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

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

  const youtubeUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${hasInteracted ? 0 : 1}&rel=0&cc_load_policy=1&cc_lang_pref=en&playsinline=1&iv_load_policy=3&modestbranding=1&controls=1&fs=1`
    : null;

  return (
    <div
      className="relative w-full h-[80vh] bg-cover bg-top transition-all duration-1000 overflow-hidden mt-[-62px] pt-[62px]"
      style={{ backgroundImage: backdrop ? `url(${backdrop})` : "none" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-center">
        {/* LEFT */}
        <div className="w-1/2 px-4 flex flex-col gap-4 z-10">
          <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
            🎬 Coming Soon
          </p>
          <h1 className="text-4xl font-black text-white leading-tight">
            {movie.displayTitle}{" "}
            {/* <span className="text-xs text-gray-400">
              (
              {movie.mediaType?.charAt(0).toUpperCase() +
                movie.mediaType?.slice(1)}
              )
            </span> */}
          </h1>
          <div className="flex gap-4 text-gray-400">
            <span>📅 {movie.displayDate}</span>
            {movie.vote_average > 0 && (
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            )}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-5">
            {movie.overview}
          </p>
          <div className="flex gap-3">
            <Link
              to={
                movie.mediaType === "tv"
                  ? `/tv/${movie.id}`
                  : `/movie/${movie.id}`
              }
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
              Next
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 px-2 z-10">
          {trailerMode ? (
            <div
              className="w-full aspect-video rounded-xl overflow-hidden
              shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/20 relative"
            >
              {loadingTrailer ? (
                <div
                  className="w-full h-full bg-black/50 flex items-center
                  justify-center text-gray-500 animate-pulse text-sm"
                >
                  Loading trailer...
                </div>
              ) : trailerKey && !noTrailer ? (
                <iframe
                  ref={iframeRef}
                  src={youtubeUrl}
                  title={`Trailer for ${movie.displayTitle}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div
                  className="w-full h-full bg-black/30 flex flex-col items-center
                  justify-center gap-4 text-gray-400 relative overflow-hidden rounded-xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${backdrop})` }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                    <span className="text-4xl">🎬</span>
                    <h3 className="text-lg font-semibold text-white">
                      Trailer Not Available
                    </h3>
                    <p className="text-sm">
                      Moving to next in{" "}
                      <span className="text-green-400 font-bold">10s</span>...
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setHasInteracted(true);
                  setTrailerMode((p) => !p);
                }}
                className="absolute bottom-3 left-3 z-20 px-3 py-2  font-semibold
                  rounded-lg border border-black/30 transition-colors bg-red-600 hover:bg-red-500 text-white"
              >
                Stop
              </button>
            </div>
          ) : (
            <div
              className="w-full aspect-video rounded-xl overflow-hidden
              shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 relative"
            >
              <img
                src={
                  backdrop ||
                  "https://via.placeholder.com/640x360?text=No+Image"
                }
                alt={movie.displayTitle}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => {
                  setHasInteracted(true);
                  setTrailerMode((p) => !p);
                }}
                className="absolute bottom-3 left-3 z-20 px-3 py-2  font-semibold
                  rounded-lg border border-black/30 transition-colors bg-green-500 hover:bg-green-600 text-white"
              >
                Play Trailer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-10 flex gap-2 z-10">
        {upcomingMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              clearAllTimers();
              setCurrent(i);
              setNoTrailer(false);
            }}
            className={`h-1 rounded-full transition-all duration-300
              ${i === current ? "w-6 bg-green-400" : "w-2 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

// reusable hook for fetching a single endpoint

function Banner() {
  const [upcomingRaw, setUpcomingRaw] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&release_date.gte=${today}&sort_by=first_air_date.asc`;
    //    const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date.gte=${today}&sort_by=first_air_date.asc`;

    Promise.all([
      // movies — 6 pages
      axios.get(`${movieUrl}&page=1`),
      axios.get(`${movieUrl}&page=2`),
      axios.get(`${movieUrl}&page=3`),
      axios.get(`${movieUrl}&page=4`),
      axios.get(`${movieUrl}&page=5`),
      axios.get(`${movieUrl}&page=6`),

      // tv shows — 4 pages
      // axios.get(`${tvUrl}&page=1`),
      // axios.get(`${tvUrl}&page=2`),
      // axios.get(`${tvUrl}&page=3`),
      // axios.get(`${tvUrl}&page=4`),
    ])
      .then((responses) => {
        const allMovies = responses
          .slice(0, 6)
          .flatMap((res) => res.data.results || [])
          .map((m) => ({
            ...m,
            mediaType: "movie",
            displayTitle: m.title,
            displayDate: m.release_date,
          }))
          .filter((m) => m.displayDate && m.displayDate >= today)
          .filter((m) => m.backdrop_path && m.poster_path && m.overview)
          .filter((m) => m.popularity > 5)
          .filter((m, i, self) => self.findIndex((x) => x.id === m.id) === i)
          .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
          .slice(0, 30);

        // const allShows = responses
        //   .slice(6)
        //   .flatMap((res) => res.data.results || [])
        //   .map((s) => ({
        //     ...s,
        //     mediaType: "tv",
        //     displayTitle: s.name,
        //     displayDate: s.first_air_date,
        //   }))
        //   .filter((m) => m.displayDate && m.displayDate >= today)
        //   .filter((m) => m.backdrop_path && m.poster_path && m.overview)
        //   .filter((m) => m.popularity > 3)
        //   .filter((m, i, self) => self.findIndex((x) => x.id === m.id) === i)
        //   .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
        //   .slice(0, 20); // ← top 3 shows

        // const combined = [...allMovies, ...allShows]
        //   // must be future release
        //   .filter((m) => m.displayDate && m.displayDate >= today)
        //   // must have images and overview for hero to look good
        //   .filter((m) => m.backdrop_path && m.poster_path && m.overview)
        //   // must be popular enough to have a trailer
        //   .filter((m) => m.popularity > 4)
        //   // remove duplicates
        //   .filter((m, i, self) => self.findIndex((x) => x.id === m.id) === i)
        //   // sort by nearest release date first
        //   .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
        //   .slice(0, 40);

        // console.log("Movies fetched:", allMovies);
        // console.log("Shows fetched:", allShows);
        // console.log("Combined filtered:", combined);

        //       setUpcomingRaw(combined);
        setUpcomingRaw(allMovies);
      })
      .catch(console.log);
  }, []);

  return (
    <div>
      {/* HERO */}
      <Hero movies={upcomingRaw} />
    </div>
  );
}

export default Banner;
