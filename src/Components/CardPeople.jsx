import React, { useContext } from "react";
import { MovieContext } from "./MovieContext";
import { Link } from "react-router-dom";

function CardPeople({ personobject }) {
  let { watchList, handleAddToWatchList, handleRemoveFromWatchList } =
    useContext(MovieContext);
  // console.log(personobject);

  const isInWatchlist = watchList.some(
    (person) => person.id === personobject?.id,
  );

  return (
    <div className=" ">
      <Link to={`/person/${personobject.id}`}>
        <div
          className="w-48 sm:w-56 md:w-64 aspect-[2/3] hover:scale-105 m-1 relative  transition duration-300  rounded-lg bg-cover"
          style={{
            backgroundImage: `url(
            https://image.tmdb.org/t/p/original/${personobject.profile_path}
          )`,
          }}
        >
          <h5 className="text-white justify-center text-center font-bold rounded-t-lg  bg-black/70 p-2 ">
            {/* {personobject.name} */}
            {personobject.name}
          </h5>
          <div className=" text-xl absolute bottom-0 left-0 rounded-lg  bg-black/70 m-1 text-white p-3 ">
            {Number(personobject.popularity.toFixed(1))}
            {/* {personobject.known_for_department} */}
          </div>
          {isInWatchlist ? (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromWatchList(personobject);
              }}
              className="fa-solid absolute bottom-0 right-0 text-red-500 text-3xl p-3 fa-heart"
            ></i>
          ) : (
            <i
              onClick={(e) => {
                e.preventDefault();
                handleAddToWatchList(showobject);
              }}
              className="fa-regular p-3 text-white absolute bottom-0 right-0  hover:text-red-500 text-3xl  fa-heart"
            ></i>
          )}
        </div>
      </Link>
    </div>
  );
}

export default CardPeople;
