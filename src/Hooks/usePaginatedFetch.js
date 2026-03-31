import { useState, useEffect } from "react";
import axios from "axios";

function usePaginatedFetch(endpoint) {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const API_KEY = import.meta.env.VITE_MOVIE_KEY;

    const page1 = axios.get(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&page=${pages * 2 - 1}`,
    );
    const page2 = axios.get(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&page=${pages * 2}`,
    );

    Promise.all([page1, page2])
      .then(([res1, res2]) => {
        const combined = [
          ...(res1.data.results || []),
          ...(res2.data.results || []),
        ];
        setData(combined);
      })
      .catch((err) => {
        console.log(err);
        setError("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [endpoint, pages]);

  function handleprevious() {
    if (pages > 1) {
      setPages((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlenext() {
    setPages((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ✅ new — jump directly to any page number
  function goToPage(page) {
    if (page >= 1) {
      setPages(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function resetPages() {
    setPages(1);
  }

  return {
    data,
    pages,
    loading,
    error,
    handlenext,
    handleprevious,
    goToPage, // ← export it
    resetPages,
  };
}

export default usePaginatedFetch;
