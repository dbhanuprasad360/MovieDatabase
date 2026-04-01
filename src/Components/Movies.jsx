import React, { useState } from "react";
import Banner from "./Banner";
import Pagination from "./Pagination";
import usePaginatedFetch from "../Hooks/usePaginatedFetch";
import MediaCard from "./MediaCard";

const categories = [
  { title: "Popular", endpoint: "movie/popular" },
  { title: "Trending Today", endpoint: "trending/movie/day" },
  { title: "This Week", endpoint: "trending/movie/week" },
  { title: "Top Rated", endpoint: "movie/top_rated" },
  { title: "Now Playing", endpoint: "movie/now_playing" },
  { title: "Upcoming", endpoint: "movie/upcoming" },
];

const Movies = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
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

  function changeCategory(index) {
    if (index === categoryIndex) return;
    setCategoryIndex(index);
    resetPages();
  }

  return (
    <div>
      <Banner />
      <div className="w-full mt-[58px]">
        {/* CATEGORY TABS — like Fun page */}
        <div className="px-6 pt-8 pb-4">
          <h1
            className="text-3xl font-black tracking-wider text-white mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MOVIES
          </h1>
          <div className="flex flex-wrap gap-3 border-b border-white/[0.06] pb-4">
            {categories.map(({ title }, index) => (
              <button
                key={title}
                onClick={() => changeCategory(index)}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all
                  ${
                    categoryIndex === index
                      ? "bg-green-500 text-white border-green-500"
                      : "border-white/20 text-gray-400 hover:border-green-500/40 hover:text-white"
                  }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-white text-center mt-20 animate-pulse text-lg">
            Loading...
          </div>
        )}

        {/* ERROR */}
        {error && <div className="text-red-400 text-center mt-20">{error}</div>}

        {/* MOVIES GRID */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-3 px-6 mt-6">
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
