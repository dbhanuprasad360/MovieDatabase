import React, { useEffect, useState, useContext } from "react";
import Pagination from "./Pagination";
import Banner from "./Banner";
import usePaginatedFetch from "../Hooks/usePaginatedFetch";
import MediaCard from "./MediaCard";

const categories = [
  { title: "Top Rated Shows", endpoint: "tv/top_rated" },
  { title: "Popular Shows", endpoint: "tv/popular" },
  { title: "Trending This Week", endpoint: "trending/tv/week" },
  { title: "On The Air", endpoint: "tv/on_the_air" },
  { title: "Airing Today", endpoint: "tv/airing_today" },
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
    goToPage,
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
      <div className="w-full mt-[58px]">
        {/* SECTION TITLE */}
        <div className="flex justify-center pt-10 mb-10">
          <div
            onClick={changeCategory}
            className={`w-[300px] h-[80px] flex items-center justify-center
          text-white text-3xl font-bold rounded-xl relative 
          bg-gradient-to-r from-black via-gray-900 to-black
          border border-gray-700 shadow-lg cursor-pointer
          hover:border-green-500 hover:scale-105
          transition-all duration-500
          ${flip ? "sectionFlip" : ""}`}
          >
            {currentCategory.title}
          </div>
        </div>

        {/* SHOWS GRID */}
        <div className="flex flex-wrap justify-center gap-3">
          {shows.map((showobj) => (
            <MediaCard key={showobj.id} item={showobj} type="tv" />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-10">
          <Pagination
            prevFn={handleprevious}
            pageNumber={pages}
            nextFn={handlenext}
            goToPage={goToPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TvShows;
