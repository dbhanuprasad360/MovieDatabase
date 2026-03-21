import React, { useContext } from "react";
import { MovieContext } from "./MovieContext";
import { Link } from "react-router-dom";

function CardMovie({ movieobject }) {
  const { watchList, handleAddToWatchList, handleRemoveFromWatchList } =
    useContext(MovieContext);

  const isInWatchlist = watchList.some((movie) => movie.id === movieobject?.id);

  // SAFE poster
  const poster = movieobject?.poster_path
    ? `https://image.tmdb.org/t/p/original${movieobject.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  // SAFE rating
  const rating = movieobject?.vote_average
    ? movieobject.vote_average.toFixed(1)
    : "N/A";

  return (
    <div className="m-1">
      <Link to={`/movie/${movieobject.id}`}>
        <div
          className="w-48 sm:w-56 md:w-64 aspect-[2/3] mb-10 relative rounded-lg bg-cover bg-center hover:scale-105 transition duration-300"
          style={{ backgroundImage: `url(${poster})` }}
        >
          <h5 className="text-white text-center font-bold bg-black/70 p-2 rounded-t-lg">
            {movieobject?.title || "Unknown Movie"}
          </h5>

          <div className="text-xl absolute bottom-0 left-0 rounded-lg bg-black/70 m-1 text-white p-3">
            ⭐ {rating}
          </div>

          {isInWatchlist ? (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromWatchList(movieobject);
              }}
              className="fa-solid fa-heart absolute bottom-0 right-0 text-red-500 text-3xl p-3 cursor-pointer"
            ></i>
          ) : (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleAddToWatchList(movieobject);
              }}
              className="fa-regular fa-heart absolute bottom-0 right-0 text-white hover:text-red-500 text-3xl p-3 cursor-pointer"
            ></i>
          )}
        </div>
      </Link>
    </div>
  );
}

export default CardMovie;
