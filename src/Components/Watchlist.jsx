import React, { useState } from "react";
import MediaCard from "./MediaCard";
import { useWatchlist } from "../Hooks/useWatchlist";

const Watchlist = () => {
  const { watchlist, getByType, clearWatchlist } = useWatchlist();
  const [filterType, setFilterType] = useState("all");

  const filterTypes = [
    { id: "all", label: "All Items", count: watchlist.length },
    { id: "movie", label: "Movies", count: getByType("movie").length },
    { id: "tv", label: "TV Shows", count: getByType("tv").length },
    { id: "person", label: "People", count: getByType("person").length },
  ];

  const displayItems = filterType === "all" ? watchlist : getByType(filterType);

  const sortedItems = [...displayItems].sort(
    (a, b) => new Date(b.addedDate) - new Date(a.addedDate),
  );

  return (
    <div className="w-full bg-black min-h-screen mt-[58px]">
      {/* HEADER */}
      <div className="px-6 pt-8 pb-6">
        <h1
          className="text-3xl font-black tracking-wider text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          MY WATCHLIST
        </h1>
        <p className="text-gray-400 text-sm">
          {sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="px-6 pb-4 border-b border-white/[0.06]">
        <div className="flex flex-wrap gap-3">
          {filterTypes.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setFilterType(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${
                filterType === id
                  ? "bg-green-500 text-white border-green-500"
                  : "border-white/20 text-gray-400 hover:border-green-500/40 hover:text-white"
              }`}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {sortedItems.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg mb-4">
            {filterType === "all"
              ? "Your watchlist is empty. Start adding content!"
              : `No ${filterTypes.find((f) => f.id === filterType)?.label.toLowerCase()} in your watchlist.`}
          </p>
        </div>
      )}

      {/* ITEMS GRID */}
      {sortedItems.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center gap-3 px-6 mt-6">
            {sortedItems.map((item) => (
              <MediaCard
                key={`${item.id}-${item.mediaType}`}
                item={item}
                type={item.mediaType}
              />
            ))}
          </div>

          {/* CLEAR WATCHLIST BUTTON */}
          <div className="flex justify-center mt-8 ">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear your entire watchlist?",
                  )
                ) {
                  clearWatchlist();
                }
              }}
              className="px-6 py-2 mb-10 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 transition-all text-sm font-medium"
            >
              Clear Watchlist
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Watchlist;
