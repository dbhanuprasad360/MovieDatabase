import { useContext, createContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add item (movie, show, or person)
  const addToWatchlist = (item, type) => {
    const itemWithType = {
      ...item,
      mediaType: type,
      addedDate: new Date().toISOString(),
    };

    // Avoid duplicates
    const exists = watchlist.some(
      (w) => w.id === item.id && w.mediaType === type,
    );

    if (!exists) {
      setWatchlist([...watchlist, itemWithType]);
    }
  };

  // Remove item
  const removeFromWatchlist = (id, type) => {
    setWatchlist(
      watchlist.filter((item) => !(item.id === id && item.mediaType === type)),
    );
  };

  // Check if item is in watchlist
  const isInWatchlist = (id, type) => {
    return watchlist.some((item) => item.id === id && item.mediaType === type);
  };

  // Get items by type (for filtering)
  const getByType = (type) => {
    return watchlist.filter((item) => item.mediaType === type);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        getByType,
        clearWatchlist: () => setWatchlist([]),
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
};
