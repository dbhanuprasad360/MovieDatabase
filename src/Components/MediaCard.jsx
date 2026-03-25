import { useContext } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "./MovieContext";

function MediaCard({ item, type }) {
  const { watchList, handleAddToWatchList, handleRemoveFromWatchList } =
    useContext(MovieContext);

  const isInWatchlist = watchList.some((w) => w.id === item?.id);

  // image path differs for people
  const imagePath = type === "person" ? item?.profile_path : item?.poster_path;
  const poster = imagePath
    ? `https://image.tmdb.org/t/p/w342${imagePath}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  // label differs — movies have title, shows and people have name
  const label = item?.title || item?.name || "Unknown";

  // stat differs — people show popularity, others show rating
  const stat =
    type === "person"
      ? `👤 ${Number(item?.popularity?.toFixed(1))}`
      : `⭐ ${item?.vote_average ? item.vote_average.toFixed(1) : "N/A"}`;

  // link differs per type
  const link =
    type === "movie"
      ? `/movie/${item?.id}`
      : type === "tv"
        ? `/tv/${item?.id}`
        : `/person/${item?.id}`;

  return (
    <div className="m-1 flex flex-col w-36 sm:w-40 md:w-48">
      <Link to={link}>
        <div
          className="w-full aspect-[2/3] relative rounded-lg bg-cover bg-center
          hover:scale-105 transition duration-300"
          style={{ backgroundImage: `url(${poster})` }}
        >
          {/* WATCHLIST HEART — top right ✅ */}
          {isInWatchlist ? (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromWatchList(item);
              }}
              className="fa-solid fa-heart absolute top-0 right-0 text-red-500
              text-2xl p-3 cursor-pointer"
            ></i>
          ) : (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleAddToWatchList(item);
              }}
              className="fa-regular fa-heart absolute top-0 right-0 text-white
              hover:text-red-500 text-2xl p-3 cursor-pointer"
            ></i>
          )}
        </div>

        {/* TITLE — below image ✅ */}
        <h5 className="text-white text-center font-bold mt-2 text-sm leading-tight line-clamp-2 px-1">
          {label}
        </h5>

        {/* RATING — below title ✅ */}
        <p className="text-gray-400 text-center text-xs mt-1">{stat}</p>
      </Link>
    </div>
  );
}

export default MediaCard;
