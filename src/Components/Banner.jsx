import React from "react";

function Banner() {
  return (
    <div className="">
      <div
        className="fixed -z-100 h-[100vh] w-[100vw] bg-cover"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        }}
      >
        {/* <div className="relative h-[100vh] bg-gradient-to-t from-black to-transparent"></div> */}
      </div>
    </div>
  );
}

export default Banner;
