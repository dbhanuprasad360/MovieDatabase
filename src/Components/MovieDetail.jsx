import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function MovieDetail() {
  const { id } = useParams();
  // useParams reads the :id from the URL
  // so if URL is /movie/550, id = "550"

  const navigate = useNavigate();
  // useNavigate lets us go back programmatically

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_MOVIE_KEY;

  useEffect(() => {
    // Promise.all — fetch movie details AND cast at the same time
    Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),
      axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
      ),
    ])
      .then(([movieRes, castRes]) => {
        setMovie(movieRes.data);
        setCast(castRes.data.cast.slice(0, 8)); // top 8 cast members only
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);
  // runs every time id changes — so navigating from one movie to another re-fetches

  // show loading screen while fetching
  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl animate-pulse">
        Loading...
      </div>
    );

  // show error if movie not found
  if (!movie)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Movie not found.
      </div>
    );

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* BACKDROP IMAGE — full width banner at top */}
      {backdrop && (
        <div
          className="w-full h-[90vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          {/* dark gradient so text below is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        // navigate(-1) means "go back one page in history"
        // just like clicking the browser back button
        className="fixed top-20 left-16 z-50 bg-black/60 hover:bg-black/90
        text-white px-4 py-2 rounded-full text-sm transition-all border border-white/20"
      >
        ← Back
      </button>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto  -mt-120 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* POSTER */}
          <img
            src={poster}
            alt={movie.title}
            className="w-72  rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0"
          />

          {/* INFO */}
          <div className="flex flex-col pt-40 gap-4">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            {/* GENRES — mapped from array */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* STATS */}
            <div className="flex gap-6 text-sm text-gray-400">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>🕐 {movie.runtime} min</span>
              <span>📅 {movie.release_date}</span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>
        </div>

        {/* CAST SECTION */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex flex-wrap gap-4">
              {cast.map((member) => (
                <div key={member.id} className="text-center">
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                        : "https://via.placeholder.com/80x80?text=?"
                    }
                    alt={member.name}
                    className="w-28 h-36 rounded-lg object-cover mx-auto mb-2 border-2 border-white/20"
                  />
                  <p className="text-xs text-gray-300 leading-tight">
                    {member.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
