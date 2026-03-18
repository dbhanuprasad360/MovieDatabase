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

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [pages, setPages] = useState(1);

  const currentCategory = categories[categoryIndex];

  function handleprevious() {
    if (pages > 1) {
      setPages(pages - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handlenext() {
    setPages(pages + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/${currentCategory.endpoint}?api_key=045795056156ee5e7e10fb86ea55ef40&page=${pages}`;

    axios
      .get(url)
      .then((response) => {
        setMovies(response.data.results || []);
      })
      .catch((err) => console.log(err));
  }, [categoryIndex, pages]);

  function changeCategory() {
    setFlip(true);

    setTimeout(() => {
      setCategoryIndex((prev) => (prev + 1) % categories.length);
      setPages(1);
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
