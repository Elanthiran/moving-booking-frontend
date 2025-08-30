import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  fetchTheatresByCity,
  setFilteredCities,
  setSearchTerm,
  setSelectedCity,
  setTheatres,
  setError,
  fetchShows,
  setSelectedMovie,
} from "../Redux/slice/movieSlice";
import MoviesView from "./MoviesView";
import AuthPage from "../components/AuthPage";
import { useNavigate } from "react-router-dom";

const Location = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "";
  const username = user.username || "";

  const {
    cityList = [],
    searchTerm = "",
    filteredCities = [],
    theatres = [],
    error = "",
    selectedCity = null,
    show = [],
    movies = [],
  } = useSelector((state) => state.theatres);

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchShows());

    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      const parsedCity = JSON.parse(storedCity);
      dispatch(setSelectedCity(parsedCity));
      dispatch(fetchTheatresByCity(parsedCity.name));
    }
  }, [dispatch]);

  // Filter cities
  useEffect(() => {
    const filtered = cityList.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setFilteredCities(filtered));
  }, [searchTerm, cityList, dispatch]);

  const cityFilteredShows = selectedCity
    ? show.filter(
        (s) => s?.theatre?.name?.toLowerCase() === selectedCity.name?.toLowerCase()
      )
    : show;

  const movieIdsWithShowsInCity = new Set(cityFilteredShows.map((s) => s?.title?._id));
  const moviesInCity = movies.filter((m) => movieIdsWithShowsInCity.has(m._id));

  const handleCityClick = (city) => {
    localStorage.setItem("selectedCity", JSON.stringify(city));
    dispatch(setSelectedCity(city));
    dispatch(setError(""));
    dispatch(fetchTheatresByCity(city.name));
  };

  const handleChangeCity = () => {
    localStorage.removeItem("selectedCity");
    dispatch(setSelectedCity(null));
    dispatch(setTheatres([]));
    dispatch(setSearchTerm(""));
    dispatch(setError(""));
  };

  const handleMovieClick = (movie) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    dispatch(setSelectedMovie(movie));
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    navigate(`/viewMovies/${movie._id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <div className="container my-4">
      {/* User Info & Auth Buttons */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 flex-wrap">
        <div className="d-flex flex-column flex-md-row gap-2 text-md-end">
          {username && <small className="text-muted">User: <span className="text-dark">{username}</span></small>}
          {role && <small className="text-muted">Role: <span className="text-dark">{role}</span></small>}
        </div>
        <div className="d-flex flex-wrap gap-2">
          {isAuthenticated ? (
            <>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/orderlist")}>Orders</button>
              <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-outline-danger" onClick={() => setShowAuth(true)}>Sign In</button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {!selectedCity ? (
        <>
          {/* Search Input */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>

          {/* City Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>City Name</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <tr key={city._id} className="align-middle">
                      <td
                        role="button"
                        className="text-primary text-decoration-underline"
                        onClick={() => handleCityClick(city)}
                      >
                        {city.name}
                      </td>
                      <td>{city.state}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">No cities match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <h5 className="mb-2 mb-md-0">Theatres in {selectedCity.name}:</h5>
            <button className="btn btn-secondary" onClick={handleChangeCity}>Change City</button>
          </div>
          <MoviesView
            movies={moviesInCity}
            searchTerm={searchTerm}
            selectedCity={selectedCity}
            handleMovieClick={handleMovieClick}
          />
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050 }}
        >
          <AuthPage
            inlineMode={true}
            onClose={() => {
              setShowAuth(false);
              setIsAuthenticated(!!localStorage.getItem("token"));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Location;
