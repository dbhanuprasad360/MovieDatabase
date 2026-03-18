import Navbar from "./Components/Navbar";
import Banner from "./Components/Banner";
import Movies from "./Components/Movies";
import Watchlist from "./Components/Watchlist";
import Recommendation from "./Components/Recommendation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { MovieContext } from "./Components/MovieContext";
import TvShows from "./Components/TvShows";
import People from "./Components/People";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Sidebar from "./Components/Sidebar";

function App() {
  const [watchList, setwatchList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        }}
      >
        <BrowserRouter>
          <Navbar />
          <Sidebar />
          <div className="ml-[50px] flex flex-wrap">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Banner />
                    <Movies />
                  </>
                }
              />
              <Route path="/movies" element={<Movies />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/tvshow" element={<TvShows />} />
              <Route path="/Actors" element={<People />} />
              <Route
                path="/watchlist"
                element={<Watchlist watchList={watchList} />}
              />
              {/* <Route path="/recommend" element={<Recommendation />} /> */}
            </Routes>
          </div>
        </BrowserRouter>
      </MovieContext.Provider>
    </>
  );
}

export default App;
