import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdStar } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { setSelectedMovie } from '../Redux/slice/movieSlice';
import { fetchShows } from '../Redux/slice/movieSlice';


const MoviesView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || '';
  const username = user?.username || '';

  const selectedCity = useSelector((state) => state.theatres.selectedCity);
  const shows = useSelector((state) => state.theatres?.show || []);
  const movies = useSelector((state) => state.movies?.data || []);

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  // ✅ FIXED city filter
  const cityFilteredShows = selectedCity
    ? shows.filter(
        (show) =>
          show?.theatre?.name?.toLowerCase() === selectedCity.name?.toLowerCase()
      )
    : shows;

  // Get movie IDs with shows in the selected city
  const movieIdsWithShowsInCity = new Set(
    cityFilteredShows.map((show) => show?.title?._id)
  );

  // Sort and filter movies
  const sortedMovies = movies
    .filter((movie) => movie.releaseDate)
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  const filteredMovies = searchTerm
    ? sortedMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedMovies.filter((movie) => movieIdsWithShowsInCity.has(movie._id)).slice(0, 15);

  const handleMovieClick = (movie) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    dispatch(setSelectedMovie(movie));
    localStorage.setItem('selectedMovie', JSON.stringify(movie)); // ✅ Save to storage
    navigate(`/viewMovies/${movie._id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <div className="container-fluid py-3 px-3 px-md-5">
      {/* Top Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <input
          type="text"
          className="form-control flex-grow-1"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <div className="d-flex flex-row gap-2 text-md-end">
          {username && (
            <small className="text-muted">
              User: <span className="text-dark">
                {username.charAt(0).toUpperCase() + username.slice(1)}
              </span>
            </small>
          )}
          {role && (
            <small className="text-muted">
              Role: <span className="text-dark">{role}</span>
            </small>
          )}
        </div> */}
 
        {/* {isAuthenticated ? (
          <>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/orderlist')}
            >
              Orders
            </button>
            <button className="btn btn-outline-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="btn btn-outline-danger"
            onClick={() => setShowAuth(true)}
          >
            Sign In
          </button>
        )} */}
      </div> 

      {/* Admin Controls */}
      {role === 'admin' && isAuthenticated && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/addshow')}
          >
            ➕ Add Shows
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate('/movie')}
          >
            🎞️ Add Movies
          </button>
        </div>
      )}

      {/* Movie Cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((item, index) => (
            <div key={index} className="col">
              <div
                className="card h-100 shadow-sm border-0"
                onClick={() => handleMovieClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: '360px', objectFit: 'cover' }}
                />
                <div className="card-body bg-light text-center">
                  <h5 className="card-title">{item.title}</h5>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <IoMdStar className="text-warning" />
                    <span className="fw-bold">9.5</span>
                    <span className="text-muted">19k votes</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">
              No movies found for {selectedCity?.name || 'your city'}
            </p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000 }}
        >
          {/* <AuthPage
            inlineMode={true}
            onClose={() => {
              setShowAuth(false);
              setIsAuthenticated(!!localStorage.getItem('token'));
            }}
          /> */}
        </div>
      )}
    </div>
  );
};

export default MoviesView;
