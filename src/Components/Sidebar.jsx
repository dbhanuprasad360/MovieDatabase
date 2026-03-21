import React, { useState } from "react";
import logo from "../logo.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`h-screen z-15 fixed left-0 top-[58px] bg-black/85 backdrop-blur-md border-b border-white/[0.5] text-white
      flex flex-col items-start p-2
      transition-all duration-300
    overflow-hidden ${collapsed ? "w-[50px]" : "w-[170px]"}`}
    >
      {/* Toggle Button */}
      {/* <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="text-white text-xl mb-6 hover:text-green-400"
      >
        ☰
      </button> */}

      {/* Links */}
      <div className="flex flex-col mt-10 space-y-6">
        <Link
          to="/Actors"
          onClick={() => setCollapsed(true)}
          className="flex items-center  hover:text-green-400"
        >
          <span>⭐</span>
          {!collapsed && <span className="text-lg font-semibold">Stars</span>}
        </Link>

        <Link
          to="/movies"
          onClick={() => setCollapsed(true)}
          className="flex items-center  hover:text-green-400"
        >
          <span>🎬</span>
          {!collapsed && <span className="text-lg font-semibold">Movies</span>}
        </Link>

        <Link
          to="/tvshow"
          onClick={() => setCollapsed(true)}
          className="flex items-center  hover:text-green-400"
        >
          <span>📺</span>
          {!collapsed && (
            <span className="text-lg font-semibold">TV Shows</span>
          )}
        </Link>

        <Link
          to="/watchlist"
          onClick={() => setCollapsed(true)}
          className="flex items-center  hover:text-green-400"
        >
          <span>❤️</span>
          {!collapsed && (
            <span className="text-lg font-semibold">Watchlist</span>
          )}
        </Link>

        <Link
          to="/recommend"
          onClick={() => setCollapsed(true)}
          className="flex items-center  hover:text-green-400"
        >
          <span>🤖</span>
          {!collapsed && (
            <span className="text-lg font-semibold">Recommend</span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
