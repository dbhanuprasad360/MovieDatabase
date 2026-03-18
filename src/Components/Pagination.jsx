import React from "react";

const Pagination = ({ pageNumber, nextFn, prevFn }) => {
  return (
    <div className="h-[50px] w-30% z-0 bg-blue-600 border rounded-2xl flex fex-wrap m-8 justify-center text-2xl gap-5 p-2">
      {pageNumber == 1 ? (
        <></>
      ) : (
        <div onClick={prevFn}>
          <i className="fa-solid fa-arrow-left duration-300  hover:text-white"></i>
        </div>
      )}
      <div className="duration-300 text-white ">{pageNumber}</div>
      <div onClick={nextFn}>
        <i className="fa-solid fa-arrow-right duration-300  hover:text-white"></i>
      </div>
    </div>
  );
};

export default Pagination;
