import React, { useEffect, useState, useContext } from "react";
import CardShow from "./CardShow";
import Pagination from "./Pagination";
import Banner from "./Banner";
import usePaginatedFetch from "../Hooks/usePaginatedFetch";

const categories = [
  {
    title: "Top Rated Shows",
    endpoint: "tv/top_rated",
  },
  {
    title: "Popular Shows",
    endpoint: "tv/popular",
  },
  {
    title: "On Air Shows",
    endpoint: "tv/on_the_air",
  },
  {
    title: "On Air Today",
    endpoint: "tv/airing_today",
  },
];

const TvShows = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const currentCategory = categories[categoryIndex];

  const {
    data: shows,
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
      resetPages(); // reset pagination
      setFlip(false);
    }, 300);
  }

  return (
    <div>
      <Banner />
      <div className="w-full mt-20">
        {/* SECTION TITLE */}
        <div className="flex justify-center mb-10">
          <div
            onClick={changeCategory}
            className={`w-[300px] h-[80px] flex items-center justify-center
          text-white text-3xl font-bold rounded-xl relative 
          bg-gradient-to-r from-black via-gray-900 to-black
          border border-gray-700 shadow-lg cursor-pointer
          hover:border-blue-500 hover:scale-105
          transition-all duration-500
          ${flip ? "sectionFlip" : ""}`}
          >
            {currentCategory.title}
          </div>
        </div>

        {/* SHOWS GRID */}
        <div className="flex flex-wrap justify-center gap-1">
          {shows.map((showobj) => (
            <CardShow key={showobj.id} showobject={showobj} />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-10">
          <Pagination
            prevFn={handleprevious}
            pageNumber={pages}
            nextFn={handlenext}
          />
        </div>
      </div>
    </div>
  );
};

export default TvShows;
