import React, { useEffect } from 'react';
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

const Location = () => {
  const dispatch = useDispatch();

  const {
    cityList = [],
    searchTerm = '',
    filteredCities = [],
    theatres = [],
    error = '',
    selectedCity = null,
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
    const filtered = cityList.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setFilteredCities(filtered));
  }, [searchTerm, cityList, dispatch]);

  const handleCityClick = (city) => {
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
      {/* <h3 className="mb-3">Select City</h3> */}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!selectedCity ? (
        <>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
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
                {filteredCities.length > 0 ? (
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
          {/* <h4>
            Selected City: {selectedCity.name}, {selectedCity.state}
          </h4> */}
          <h5>Theatres in {selectedCity.name}:</h5>
          <button className="btn btn-secondary my-3" onClick={handleChangeCity}>
            Change City
          </button>
<MoviesView />
          <div>
            
           
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
