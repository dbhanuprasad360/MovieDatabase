import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_MOVIE_KEY;

  useEffect(() => {
    Promise.all([
      axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`),
      axios.get(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`,
      ),
    ])
      .then(([showRes, creditsRes]) => {
        setShow(showRes.data);
        setCast(creditsRes.data.cast.slice(0, 8));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl animate-pulse">
        Loading...
      </div>
    );

  if (!show)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Show not found.
      </div>
    );

  const backdrop = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : null;

  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/original${show.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="min-h-screen bg-black text-white -ml-[50px]">
      {/* BACKDROP */}
      {backdrop && (
        <div
          className="w-full h-[80vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-16 z-50 bg-black/60 hover:bg-black/90
        text-white px-4 py-2 rounded-full text-sm transition-all border border-white/20"
      >
        ← Back
      </button>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6 -mt-72 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* POSTER */}
          <img
            src={poster}
            alt={show.name}
            className="w-48 md:w-64 rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0"
          />

          {/* INFO */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{show.name}</h1>

            {/* GENRES */}
            <div className="flex flex-wrap gap-2">
              {show.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* STATS — different from movie: seasons instead of runtime */}
            <div className="flex gap-6 text-sm text-gray-400">
              <span>⭐ {show.vote_average?.toFixed(1)}</span>
              <span>📺 {show.number_of_seasons} seasons</span>
              <span>📅 {show.first_air_date}</span>
            </div>

            <p className="text-gray-300 leading-relaxed">{show.overview}</p>
          </div>
        </div>

        {/* CAST */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex flex-wrap gap-4">
              {cast.map((member) => (
                <div key={member.id} className="text-center w-36">
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                        : "https://via.placeholder.com/80x80?text=?"
                    }
                    alt={member.name}
                    className="w-36 h-48 rounded-lg object-cover mx-auto mb-2 border-2 border-white/20"
                  />
                  <p className="text-sm text-gray-300 leading-tight">
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

export default ShowDetail;
