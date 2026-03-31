import Navbar from "./Components/Navbar";
import Banner from "./Components/Banner";
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // renders nothing, just runs the effect
}

function App() {
  const [watchList, setwatchList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAddToWatchList = (movieobject) => {
    let updatedWatchList = [...watchList, movieobject];
    setwatchList(updatedWatchList);
    localStorage.setItem("Movies", JSON.stringify(updatedWatchList));
  };
  // console.log(watchList);
  // const handleRemoveFromWatchList = (movieobject) => {
  //   // let updatedWatchList = [...watchList, movieobject];
  //   // setwatchList(updatedWatchList);
  //   // localStorage.setItem("Movies", JSON.stringify(updatedWatchList));
  // };

  function handleRemoveFromWatchList(movie) {
    const updatedList = watchList.filter((m) => m.id !== movie.id);
    setwatchList(updatedList);
    localStorage.setItem("Movies", JSON.stringify(updatedList));
  }

  function handleDelete(id) {
    const updatedList = watchList.filter((movie) => movie.id !== id);
    setwatchList(updatedList);
    localStorage.setItem("Movies", JSON.stringify(updatedList));
  }

  useEffect(() => {
    let moviesfromlS = localStorage.getItem("Movies");
    if (!moviesfromlS) {
      return;
    }
    setwatchList(JSON.parse(moviesfromlS));
  }, []);

  return (
    <>
      <MovieContext.Provider
        value={{
          handleAddToWatchList,
          handleRemoveFromWatchList,
          handleDelete,
          watchList,
          isLoggedIn,
          setIsLoggedIn,
          isAdmin,
          setIsAdmin,
        }}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          {/* <Sidebar /> */}
          <div className="mt-[62px] ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tvshow" element={<TvShows />} />
              <Route path="/Actors" element={<People />} />
              <Route path="/fun" element={<Fun />} />

              {/* <Route
                path="/watchlist"
                element={<Watchlist watchList={watchList} />}
              />
              <Route path="/recommend" element={<Recommendation />} />*/}
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
      </MovieContext.Provider>
    </>
  );
}

export default App;
