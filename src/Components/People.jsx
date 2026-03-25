import React, { useEffect, useState, useContext } from "react";
import CardPeople from "./CardPeople";
import axios from "axios";
import Pagination from "./Pagination";
import Banner from "./Banner";
import usePaginatedFetch from "../Hooks/usePaginatedFetch";
import MediaCard from "./MediaCard";

const categories = [
  { title: "Popular Actors", endpoint: "person/popular" },
  { title: "Trending Today", endpoint: "trending/person/day" },
  { title: "Trending This Week", endpoint: "trending/person/week" },
];

const People = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const currentCategory = categories[categoryIndex];

  const {
    data: people,
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
      <div className="w-full mt-[58px]">
        {/* SECTION TITLE */}
        <div className="flex justify-center pt-10 mb-10">
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

        {/* People GRID */}
        <div className="flex flex-wrap justify-center gap-3">
          {people.map((peopleobj) => (
            <MediaCard key={movieobj.id} item={movieobj} type="person" />
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

export default People;
