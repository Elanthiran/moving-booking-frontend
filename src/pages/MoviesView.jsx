import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoviesAndShows,
  setError,
} from "../Redux/slice/movieSlice";

const MoviesView = () => {
  const dispatch = useDispatch();

  const {
    movies = [],
    shows = [],
    selectedCity = null,
    theatres = [],
    error = "",
  } = useSelector((state) => state.theatres);

  // fetch movies & shows for current city/theatres
  useEffect(() => {
    if (selectedCity && theatres.length > 0) {
      dispatch(fetchMoviesAndShows({ city: selectedCity.name }));
    } else {
      dispatch(setError(""));
    }
  }, [dispatch, selectedCity, theatres]);

  return (
    <div className="container my-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <h4 className="mb-3">Now Showing in {selectedCity?.name}</h4>

      {movies.length === 0 ? (
        <p>No movies available for this city.</p>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <div key={movie._id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={movie.posterUrl || "/placeholder-movie.jpg"}
                  alt={movie.title}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">{movie.genre}</p>

                  <h6 className="mt-2">Shows:</h6>
                  <ul className="list-unstyled">
                    {shows
                      .filter((show) => show.movieId === movie._id)
                      .map((show) => (
                        <li key={show._id}>
                          {show.theatre?.name} – {show.time}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesView;
