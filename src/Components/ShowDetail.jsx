import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function ShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_MOVIE_KEY;

  useEffect(() => {
    Promise.all([
      axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`),
      axios.get(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`,
      ),
      axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`,
      ), // ← add this
    ])
      .then(([showRes, creditsRes, videosRes]) => {
        setShow(showRes.data);
        setCast(creditsRes.data.cast.slice(0, 8));

        const videos = videosRes.data.results;
        const officialTrailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube");
        if (officialTrailer) setTrailer(officialTrailer.key);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!show) return; // guard stays
    setEpisodesLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`,
      )
      .then((res) => setEpisodes(res.data.episodes || []))
      .catch((err) => console.log(err))
      .finally(() => setEpisodesLoading(false));
  }, [id, selectedSeason, show]);

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
    ? `https://image.tmdb.org/t/p/w342${show.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* BACKDROP */}
      {backdrop && (
        <div
          className="w-full h-[80vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-[70px] left-4 z-50 bg-black/60 hover:bg-black/90
        text-white px-4 py-2 rounded-full text-sm transition-all border border-white/20"
      >
        ← Back
      </button>

      {/* MAIN CONTENT */}
      <div
        className={`max-w-5xl mx-auto  ${backdrop ? "-mt-[30rem]" : "mt-[62px]"} px-6  relative z-10 pb-20`}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* POSTER */}
          <img
            src={poster}
            alt={show.name}
            className="w-48 md:w-64 border-1 rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0"
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
            <div className="flex gap-6 text-sm text-white">
              <span>⭐ {show.vote_average?.toFixed(1)}</span>
              <span>📺 {show.number_of_seasons} seasons</span>
              <span>📅 {show.first_air_date}</span>
            </div>

            <p className="text-gray-300 leading-relaxed">{show.overview}</p>
          </div>
        </div>

        {/* CAST */}
        {cast.length > 0 && (
          <div className="mt-12 pb-12">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex flex-wrap gap-4">
              {cast.map((member) => (
                <Link to={`/person/${member.id}`} key={member.id}>
                  <div className="text-center w-36 hover:scale-105 transition duration-300">
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w342${member.profile_path}`
                          : "https://via.placeholder.com/80x80?text=?"
                      }
                      alt={member.name}
                      className="w-36 h-48 rounded-lg object-cover mx-auto mb-2 border-2 border-white/20"
                    />
                    <p className="text-sm text-gray-300 leading-tight">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {member.character}
                    </p>
                    {/* ↑ shows the character name they played */}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TRAILER SECTION */}
        {trailer && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">🎬 Trailer</h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer}?autoplay=0&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* SEASONS & EPISODES */}
        {show.seasons && show.seasons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Seasons & Episodes</h2>

            {/* SEASON TABS */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.seasons
                .filter((s) => s.season_number > 0) // filter out "Specials" season 0
                .map((season) => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                selectedSeason === season.season_number
                  ? "bg-green-500 text-white border border-green-500"
                  : "bg-white/10 text-gray-400 border border-white/20 hover:border-green-500/40 hover:text-white"
              }`}
                  >
                    S{season.season_number}
                    <span className="ml-1 text-xs opacity-70">
                      ({season.episode_count} eps)
                    </span>
                  </button>
                ))}
            </div>

            {/* SELECTED SEASON INFO */}
            {show.seasons
              .filter((s) => s.season_number === selectedSeason)
              .map((season) => (
                <div key={season.id} className="flex gap-4 mb-6 items-start">
                  {season.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
                      alt={season.name}
                      className="w-24 rounded-lg flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {season.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      📅 {season.air_date || "TBA"} · {season.episode_count}{" "}
                      episodes
                    </p>
                    {season.overview && (
                      <p className="text-sm text-gray-300 mt-2 leading-relaxed line-clamp-3">
                        {season.overview}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {/* EPISODES LIST */}
            {episodesLoading ? (
              <div className="text-white text-center animate-pulse py-8">
                Loading episodes...
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex gap-4 bg-white/5 border border-white/10
            hover:border-green-500/30 rounded-xl p-4 transition-all"
                  >
                    {/* EPISODE STILL IMAGE */}
                    <img
                      src={
                        episode.still_path
                          ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                          : "https://via.placeholder.com/300x170?text=No+Image"
                      }
                      alt={episode.name}
                      className="w-36 h-20 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* EPISODE INFO */}
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-3">
                        {/* episode number badge */}
                        <span
                          className="text-xs font-bold bg-green-500/20 text-green-400
                  border border-green-500/30 px-2 py-0.5 rounded-md"
                        >
                          E{episode.episode_number}
                        </span>
                        <h4 className="text-white font-semibold text-sm">
                          {episode.name}
                        </h4>
                      </div>

                      <div className="flex gap-4 text-xs text-gray-500">
                        {episode.air_date && <span>📅 {episode.air_date}</span>}
                        {episode.runtime && (
                          <span>🕐 {episode.runtime} min</span>
                        )}
                        {episode.vote_average > 0 && (
                          <span>⭐ {episode.vote_average.toFixed(1)}</span>
                        )}
                      </div>

                      {episode.overview && (
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-1">
                          {episode.overview}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowDetail;
