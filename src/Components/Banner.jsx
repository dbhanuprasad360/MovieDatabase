import React from "react";

function Banner() {
  return (
    <div className="">
      <div
        className="fixed -z-100 h-[100vh] w-[100vw] bg-cover"
        style={{
          backgroundImage:
            "url(https://image.tmdb.org/t/p/original/peAzdLKtT6VDWIfPQO9LJD1NCG4.jpg",
        }}
      >
        <div className="relative h-[100vh] bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </div>
  );
}

export default Banner;
