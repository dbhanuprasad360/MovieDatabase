import React, { useState } from "react";
import Banner from "./Banner";
import Pagination from "./Pagination";
import usePaginatedFetch from "../Hooks/usePaginatedFetch";
import MediaCard from "./MediaCard";

const categories = [
  { title: "Upcoming Movies", endpoint: "movie/upcoming" },
  { title: "Popular Movies", endpoint: "movie/popular" },
  { title: "Trending Today", endpoint: "trending/movie/day" },
  { title: "Trending This Week", endpoint: "trending/movie/week" },
  { title: "Top Rated Movies", endpoint: "movie/top_rated" },
  { title: "Now Playing", endpoint: "movie/now_playing" },
];

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
    goToPage,
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
    <div>
      <Banner />
      <div className="w-full  mt-[58px]">
        {/* SECTION TITLE */}
        <div className="flex justify-center pt-10 mb-10">
          <div
            onClick={changeCategory}
            className={`w-[300px] h-[80px] flex items-center justify-center
          text-white text-3xl font-bold rounded-xl 
          bg-gradient-to-r from-black via-gray-900 to-black
          border border-gray-700 shadow-lg cursor-pointer
          hover:border-green-500 hover:scale-105
          transition-all blinkBorder duration-500
          ${flip ? "sectionFlip" : ""}`}
          >
            {currentCategory.title}
          </div>
        </div>

        {loading && (
          <div className="text-white text-center mt-20 animate-pulse">
            Loading...
          </div>
        )}
        {error && <div className="text-red-400 text-center mt-20">{error}</div>}

        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-3">
            {movies.map((movieobj) => (
              <MediaCard key={movieobj.id} item={movieobj} type="movie" />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-8">
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

export default Movies;
