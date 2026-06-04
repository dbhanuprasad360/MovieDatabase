import Navbar from "./Components/Navbar";
import Movies from "./Components/Movies";
import Watchlist from "./Components/Watchlist";
import Recommendation from "./Components/Recommendation";
import { BrowserRouter, Routes, useLocation, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { MovieContext } from "./Components/MovieContext";
import TvShows from "./Components/TvShows";
import People from "./Components/People";
import Login from "./Components/Login";
import Home from "./Components/Home";
import MovieDetail from "./Components/MovieDetail";
import ShowDetail from "./Components/ShowDetail";
import PeopleDetail from "./Components/PeopleDetail";
import Footer from "./Components/Footer";
import Fun from "./Components/Fun";
import SignUp from "./Components/SignUp";
import AdminDashboard from "./Components/AdminDashboard";
import { WatchlistProvider } from "./Hooks/useWatchlist";
import { Analytics } from "@vercel/analytics/next";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // renders nothing, just runs the effect
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <MovieContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
      }}
    >
      <WatchlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <div className="mt-[62px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tvshow" element={<TvShows />} />
              <Route path="/actors" element={<People />} />
              <Route path="/fun" element={<Fun />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/recommend" element={<Recommendation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<ShowDetail />} />
              <Route path="/person/:id" element={<PeopleDetail />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </WatchlistProvider>
    </MovieContext.Provider>
  );
}

export default App;
