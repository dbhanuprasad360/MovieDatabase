import React, { useContext } from "react";
import { MovieContext } from "./MovieContext";
import { Link } from "react-router-dom";

function CardShow({ showobject }) {
  const { watchList, handleAddToWatchList, handleRemoveFromWatchList } =
    useContext(MovieContext);

  const isInWatchlist = watchList.some((show) => show.id === showobject?.id);

  // SAFE poster
  const poster = showobject?.poster_path
    ? `https://image.tmdb.org/t/p/w342${showobject.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  // SAFE rating
  const rating = showobject?.vote_average
    ? showobject.vote_average.toFixed(1)
    : "N/A";

  return (
    <div className="m-1">
      <Link to={`/tv/${showobject.id}`}>
        <div
          className="w-48 sm:w-56 md:w-64 aspect-[2/3] relative rounded-lg bg-cover bg-center hover:scale-105 transition duration-300"
          style={{ backgroundImage: `url(${poster})` }}
        >
          <h5 className="text-white text-center font-bold bg-black/70 p-2 rounded-t-lg">
            {showobject?.name || "Unknown show"}
          </h5>

          <div className="text-xl absolute bottom-0 left-0 rounded-lg bg-black/70 m-1 text-white p-3">
            ⭐ {rating}
          </div>

          {isInWatchlist ? (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromWatchList(showobject);
              }}
              className="fa-solid fa-heart absolute bottom-0 right-0 text-red-500 text-3xl p-3 cursor-pointer"
            ></i>
          ) : (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleAddToWatchList(showobject);
              }}
              className="fa-regular fa-heart absolute bottom-0 right-0 text-white hover:text-red-500 text-3xl p-3 cursor-pointer"
            ></i>
          )}
        </div>
      </Link>
    </div>
  );
}

export default CardShow;
