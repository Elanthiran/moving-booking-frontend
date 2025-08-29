import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setSelectedMovie } from "../Redux/slice/movieSlice";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.theatres.selectedMovie);
  const navigate = useNavigate();
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Restore from localStorage if Redux store is empty
  useEffect(() => {
    if (!movie) {
      const storedMovie = localStorage.getItem('selectedMovie');
      if (storedMovie) {
        dispatch(setSelectedMovie(JSON.parse(storedMovie)));
      }
    }
  }, [movie, dispatch]);

  // Keep Redux and localStorage in sync
  useEffect(() => {
    if (movie) {
      localStorage.setItem('selectedMovie', JSON.stringify(movie)); 
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning text-center">
          No movie selected. Please go back and click a movie.
        </div>
      </div>
    );
  }

  const handleBooking = (e) => {
    e.preventDefault();
    navigate('/theatres');
  };

  const handleRating = (e) => {
    e.preventDefault();
    console.log('Rating submitted');
  };

  const handleImageClick = () => {
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank');
    } else {
      alert('No trailer URL available for this movie.');
    }
  };

  const getSummaryText = () => {
    const summary = movie.summary || 'No summary available.';
    if (showFullSummary || summary.length <= 150) {
      return summary;
    }
    return summary.slice(0, 150) + '...';
  };

  return (
    <div className="container py-4">
      <div className="row align-items-start">
        <div className="col-md-4 text-center mb-4 mb-md-0">
          <img
            src={movie.image}
            alt={movie.title}
            onClick={handleImageClick}
            className="img-fluid rounded shadow"
            style={{ cursor: 'pointer', height: '300px', width: '300px' }}
            title="Click to watch trailer"
          />
        </div>
        <div className="col-md-8">
          <h2 className="mb-3">{movie.title}</h2>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p>
            <strong>Summary:</strong> {getSummaryText()}
            {movie.summary && movie.summary.length > 150 && (
              <button
                className="btn btn-link btn-sm ps-2"
                onClick={() => setShowFullSummary((prev) => !prev)}
              >
                {showFullSummary ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>

          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-4">
              <p><strong>Cast:</strong></p>
              <div className="row">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="col-6 col-md-4 col-lg-3 mb-3 text-center">
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <div>{actor.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-outline-primary" onClick={handleRating}>
              Rate Now
            </button>
            <button className="btn btn-success" onClick={handleBooking}>
              Book Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
