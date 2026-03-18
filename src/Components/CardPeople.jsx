import React, { useContext } from "react";
import { MovieContext } from "./MovieContext";

function CardPeople({ personobject }) {
  let { watchList, handleAddToWatchList, handleRemoveFromWatchList } =
    useContext(MovieContext);
  // console.log(personobject);
  function doesContain() {
    for (let i = 0; i < watchList.length; i++) {
      if (watchList[i].id === personobject.id) {
        return true;
      }
    }
    return false;
  }
  return (
    <div className=" ">
      <div
        className=" w-40 sm:w-48 md:w-56 aspect-[2/3] hover:scale-105 m-1 relative  transition duration-300  rounded-lg bg-cover"
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
        {doesContain(personobject) ? (
          <div>
            <i
              onClick={() => handleRemoveFromWatchList(personobject)}
              className="fa-solid absolute bottom-0 right-0 text-red-500 text-3xl p-3 fa-heart"
            ></i>
          </div>
        ) : (
          <div onClick={() => handleAddToWatchList(personobject)}>
            <i className="fa-regular p-3 text-white absolute bottom-0 right-0  hover:text-red-500 text-3xl  fa-heart"></i>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardPeople;
