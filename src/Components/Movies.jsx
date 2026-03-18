const categories = [
  {
    title: "Upcoming Movies",
    endpoint: "movie/upcoming",
  },
  {
    title: "Popular Movies",
    endpoint: "movie/popular",
  },
  {
    title: "Trending Movies",
    endpoint: "trending/movie/day",
  },
];

import React, { useEffect, useState } from "react";
import CardMovie from "./CardMovie";
import axios from "axios";
import Pagination from "./Pagination";
import usePaginatedFetch from "../Hooks/usePaginatedFetch";

const Movies = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const currentCategory = categories[categoryIndex];

  const {
    data: movies,
    pages,
    loading,
    error,
    handlenext,
    handleprevious,
    resetPages,
  } = usePaginatedFetch(currentCategory.endpoint);

  function changeCategory() {
    setFlip(true);

    setTimeout(() => {
      setCategoryIndex((prev) => (prev + 1) % categories.length);
      resetPages();
      setFlip(false);
    }, 400);
  }

  return (
    <div className="w-full mt-10">
      {/* SECTION TITLE */}
      <div className="flex justify-center  mb-10">
        <div
          onClick={changeCategory}
          className={`w-[300px] h-[80px] flex items-center justify-center
          text-white text-3xl font-bold rounded-xl 
          bg-gradient-to-r from-black via-gray-900 to-black
          border border-gray-700 shadow-lg cursor-pointer
          hover:border-blue-500 hover:scale-105
          transition-all blinkBorder duration-500
          ${flip ? "sectionFlip" : ""}`}
        >
          {currentCategory.title}
        </div>
      </div>

      {/* MOVIES */}
      <div className="flex flex-wrap justify-evenly gap-1">
        {movies.map((movieobj) => (
          <CardMovie key={movieobj.id} movieobject={movieobj} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-8">
        <Pagination
          prevFn={handleprevious}
          pageNumber={pages}
          nextFn={handlenext}
        />
      </div>
    </div>
  );
};

export default Movies;
