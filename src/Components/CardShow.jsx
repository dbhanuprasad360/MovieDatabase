import React, { useContext } from "react";
import { MovieContext } from "./MovieContext";

function CardShow({ showobject }) {
  const { watchList, handleAddToWatchList, handleRemoveFromWatchList } =
    useContext(MovieContext);

  const isInWatchlist = watchList.some((show) => show.id === showobject?.id);

  // SAFE poster
  const poster = showobject?.poster_path
    ? `https://image.tmdb.org/t/p/original${showobject.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  // SAFE rating
  const rating = showobject?.vote_average
    ? showobject.vote_average.toFixed(1)
    : "N/A";

  return (
    <div className="m-1">
      <div
        className="w-40 sm:w-48 md:w-56 aspect-[2/3] relative rounded-lg bg-cover bg-center hover:scale-105 transition duration-300"
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
            onClick={() => handleRemoveFromWatchList(showobject)}
            className="fa-solid fa-heart absolute bottom-0 right-0 text-red-500 text-3xl p-3 cursor-pointer"
          ></i>
        ) : (
          <i
            onClick={() => handleAddToWatchList(showobject)}
            className="fa-regular fa-heart absolute bottom-0 right-0 text-white hover:text-red-500 text-3xl p-3 cursor-pointer"
          ></i>
        )}
      </div>
    </div>
  );
}

export default CardShow;
