import React, { useEffect, useState, useContext } from "react";
import CardPeople from "./CardPeople";
import axios from "axios";
import Pagination from "./Pagination";
import Banner from "./Banner";

const categories = [
  {
    title: "Popular Actors",
    endpoint: "person/popular",
  },
];

const People = () => {
  const [people, setPeople] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [pages, setPages] = useState(1);
  const [flip, setFlip] = useState(false);

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
        setPeople(response.data.results || []);
      })
      .catch((err) => console.log(err));
  }, [categoryIndex, pages]);

  function changeCategory() {
    setFlip(true);

    setTimeout(() => {
      setCategoryIndex((prev) => (prev + 1) % categories.length);
      setPages(1); // reset pagination
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

        {/* People GRID */}
        <div className="flex flex-wrap justify-center gap-1">
          {people.map((peopleobj) => (
            <CardPeople key={peopleobj.id} personobject={peopleobj} />
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
