import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCities,
  fetchTheatresByCity,
  setFilteredCities,
  setSearchTerm,
  setSelectedCity,
  setTheatres,
  setError,
} from '../Redux/slice/movieSlice';
import MoviesView from './MoviesView';
import AuthPage from '../components/AuthPage';

const Location = () => {
  const dispatch = useDispatch();

  // 🔑 Auth modal state
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const {
    cityList,
    searchTerm,
    filteredCities,
    theatres,
    error,
    selectedCity,
  } = useSelector((state) => state.theatres);

  // On mount: fetch cities and restore city from localStorage
  useEffect(() => {
    dispatch(fetchCities());

    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      const parsedCity = JSON.parse(storedCity);
      dispatch(setSelectedCity(parsedCity));
      dispatch(fetchTheatresByCity(parsedCity.name));
    }
  }, [dispatch]);

  // Filter cities on input change
  useEffect(() => {
    if (cityList?.length > 0) {
      const filtered = cityList.filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch(setFilteredCities(filtered));
    }
  }, [searchTerm, cityList, dispatch]);

  const handleCityClick = (city) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }

    localStorage.setItem('selectedCity', JSON.stringify(city));
    dispatch(setSelectedCity(city));
    dispatch(setError(''));
    dispatch(fetchTheatresByCity(city.name));
  };

  const handleChangeCity = () => {
    localStorage.removeItem('selectedCity');
    dispatch(setSelectedCity(null));
    dispatch(setTheatres([]));
    dispatch(setSearchTerm(''));
    dispatch(setError(''));
  };

  return (
    <div className="container my-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!selectedCity ? (
        <>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <input
              type="text"
              className="form-control w-75"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            {!isAuthenticated && (
              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>City Name</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {filteredCities?.length > 0 ? (
                  filteredCities.map((city) => (
                    <tr key={city._id}>
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
                    <td colSpan="2" className="text-center">
                      No cities match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <h5>Theatres in {selectedCity.name}:</h5>
          <button className="btn btn-secondary my-3" onClick={handleChangeCity}>
            Change City
          </button>
          <MoviesView />
        </div>
      )}

      {/* 🔑 Auth Modal */}
      {showAuth && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000 }}
        >
          <AuthPage
            inlineMode={true}
            onClose={() => {
              setShowAuth(false);
              setIsAuthenticated(!!localStorage.getItem('token'));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Location;
