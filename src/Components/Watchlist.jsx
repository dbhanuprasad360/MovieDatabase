import React, { useEffect, useState, useContext } from "react";
import genreids from "../Utilities/genres";
import { MovieContext } from "./MovieContext";

const Watchlist = ({ watchList }) => {
  let { handleDelete } = useContext(MovieContext);
  const [search, setSearch] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [currGenre, setcurrGenre] = useState("All Genres");
  const [sortOrder, setSortOrder] = useState(null);

  function handleFilter(genre) {
    setcurrGenre(genre);
  }
  // console.log(watchList);

  function handlesearch(e) {
    setSearch(e.target.value);
    // console.log(search);
  }
  function toggleSort() {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  }
  useEffect(() => {
    let temp = watchList.map((movies) => {
      return genreids[movies.genre_ids[0]];
    });
    temp = new Set(temp);
    setGenreList(["All Genres", ...temp]);
  }, [watchList]);

  // console.log(genreList); // showing all the available genres according to the watchList
  return (
    <>
      {watchList[0] ? (
        <div
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${watchList[0].poster_path}`,
          }}
          className="bg-cover bg-repeat-round w-full h-full"
        >
          <div className="flex flex-wrap justify-center m-10 items-center">
            {genreList.map((genre) => {
              return (
                <div
                  onClick={() => handleFilter(genre)}
                  className={
                    currGenre == genre
                      ? "flex justify-center hover:cursor items-center  h-[4rem] m-5 rounded-2xl  w-[10rem] bg-blue-500 border outline-0"
                      : "flex justify-center hover:cursor hover:bg-blue-500 items-center  h-[4rem] m-5 rounded-2xl  w-[10rem] bg-blue-300 border outline-0"
                  }
                >
                  {genre}
                </div>
              );
            })}
          </div>
          <div className=" flex justify-center w-full">
            <input
              type="text"
              placeholder=" Search"
              className="w-[18rem] h-[3rem] outline-none text-center border cursor hover:bg-amber-500 border-amber-700 rounded-2xl bg-amber-400 m-5"
              value={search}
              onChange={handlesearch}
            ></input>
          </div>
          <div className="container mx-auto p-6">
            <div className=" rounded-lg overflow-x-auto">
              <table className=" w-full  shadow-2xl">
                <thead className="  rounded-4xl text-xl border-b-1 bg-green-600">
                  <tr>
                    <th className="px-6 py-4 text-center">Poster</th>
                    <th className="px-6 py-4 text-center">Name </th>
                    <th className="px-6 py-4 hover:text-white text-center">
                      <button
                        onClick={toggleSort}
                        className=" px-1 py-1 rounded-2xl"
                      >
                        Rating
                        {sortOrder === "asc"
                          ? "🔼"
                          : sortOrder === "desc"
                            ? "🔽"
                            : ""}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-center">Release Date</th>
                    <th className="px-6 py-4 text-center">Genre</th>
                    <th className="px-6 py-4 text-center">Delete Movies </th>
                  </tr>
                </thead>
                <tbody className="bg-green-300 ">
                  {watchList
                    .filter((movieobject) => {
                      return currGenre == "All Genres"
                        ? true
                        : genreids[movieobject.genre_ids[0]].includes(
                            currGenre,
                          );
                    })
                    .filter((movieobject) => {
                      return movieobject.title
                        .toLowerCase()
                        .includes(search.toLowerCase());
                    })
                    .sort((a, b) => {
                      if (sortOrder === "asc") {
                        return a.vote_average - b.vote_average;
                      } else if (sortOrder === "desc") {
                        return b.vote_average - a.vote_average;
                      } else {
                        return 0; // No sorting
                      }
                    })
                    .map((movieobject) => {
                      return (
                        <tr className="border-b-1 ">
                          <td className="px-6 py-4 text-center">
                            <img
                              className="h-[9rem] w-[15rem] rounded-2xl transform hover:scale-110 transition-transform duration-300"
                              src={`https://image.tmdb.org/t/p/original/${movieobject.backdrop_path}`}
                              alt="movie"
                            />
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {movieobject.title}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {Number(movieobject.vote_average.toFixed(1))}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {movieobject.release_date}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {genreids[movieobject.genre_ids[0]]}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            <button
                              onClick={() => handleDelete(movieobject.id)}
                              className="bg-white hover:bg-red-500 text-red-500 border hover:border-red-500 font-bold hover:text-white px-3 py-1 rounded-2xl"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div
          className=" w-[100vw] h-[100vh] bg-cover flex text-center  justify-center item-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/peAzdLKtT6VDWIfPQO9LJD1NCG4.jpg}`,
          }}
        >
          Your Watchlist is empty!!! Add Movies/Shows to favourite List
        </div>
      )}
    </>
  );
};

export default Watchlist;
