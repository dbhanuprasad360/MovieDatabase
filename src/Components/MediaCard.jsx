import { useContext } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "./MovieContext";
import { useWatchlist } from "../Hooks/useWatchlist"; // ← Add this

function MediaCard({ item, type }) {
  const { isLoggedIn } = useContext(MovieContext);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // ✅ Check BOTH id AND mediaType
  const inWatchlist = isInWatchlist(item?.id, type);

  const imagePath = type === "person" ? item?.profile_path : item?.poster_path;
  const poster = imagePath
    ? `https://image.tmdb.org/t/p/w342${imagePath}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  const label = item?.title || item?.name || "Unknown";
  const stat =
    type === "person"
      ? `👤 ${Number(item?.popularity?.toFixed(1))}`
      : `⭐ ${item?.vote_average ? item.vote_average.toFixed(1) : "N/A"}`;

  const link =
    type === "movie"
      ? `/movie/${item?.id}`
      : type === "tv"
        ? `/tv/${item?.id}`
        : `/person/${item?.id}`;

  // ✅ Single handler with stopPropagation
  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents Link navigation

    if (inWatchlist) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist(item, type);
    }
  };

  return (
    <div className="m-1 flex flex-col max-w-36 w-full">
      <Link to={link}>
        <div
          className="w-full aspect-[2/3] relative rounded-lg bg-cover bg-center
          hover:scale-105 transition duration-300 overflow-hidden"
          style={{ backgroundImage: `url(${poster})` }}
        >
          {/* ✅ Simplified heart with conditional styling */}
          <div
            className="absolute top-2 right-2 p-2 z-10 cursor-pointer"
            onClick={handleHeartClick}
          >
            <i
              className={`fa-heart text-xl transition-colors ${
                inWatchlist
                  ? "fa-solid text-red-500"
                  : "fa-regular text-white hover:text-red-400"
              }`}
            />
          </div>
        </div>

        <h5 className="text-white text-center font-bold mt-2 text-sm leading-tight line-clamp-2 px-1">
          {label}
        </h5>
        <p className="text-gray-400 text-center text-xs mt-1">{stat}</p>
      </Link>
    </div>
  );
}

export default MediaCard;
