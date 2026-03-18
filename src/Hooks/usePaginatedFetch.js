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

    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=045795056156ee5e7e10fb86ea55ef40&page=${pages}`;

    axios
      .get(url)
      .then((res) => setData(res.data.results || []))
      .catch((err) => {
        console.log(err);
        setError("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [endpoint, pages]); // re-runs when either changes

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
    resetPages,
  };
}

export default usePaginatedFetch;
