import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedMovie, setSelectedSeats, setSelectedShowId, setShow } from '../Redux/slice/movieSlice';
import { formatDate, formatCurrency, formatTime } from '../utils/formatters';

const Bookingseats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const seats = useSelector((state) => state.theatres.selectedSeats || []);
  const showId = useSelector((state) => state.theatres.selectedShowId);
  const allShows = useSelector((state) => state.theatres.show || []);
  const movie = useSelector((state) => state.theatres.selectedMovie);

  // Pricing
  const ticketPrice = useSelector((state) => state.theatres.ticketPrice);
  const totalPrice = useSelector((state) => state.theatres.totalPrice);
  const taxAmount = useSelector((state) => state.theatres.taxAmount);
  const totalAmtWithTax = useSelector((state) => state.theatres.totalAmtWithTax);

  // ✅ Restore state from localStorage on mount
  useEffect(() => {
    const savedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const savedShowId = JSON.parse(localStorage.getItem('selectedShowId'));
    const savedShows = JSON.parse(localStorage.getItem('show'));
    const savedMovie = JSON.parse(localStorage.getItem('selectedMovie')); // ✅ fixed JSON typo

    if (savedSeats) dispatch(setSelectedSeats(savedSeats));
    if (savedShowId) dispatch(setSelectedShowId(savedShowId));
    if (savedShows) dispatch(setShow(savedShows));
    if (savedMovie) dispatch(setSelectedMovie(savedMovie));
  }, [dispatch]);

  // ✅ Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedSeats', JSON.stringify(seats));
    localStorage.setItem('selectedShowId', JSON.stringify(showId));
    localStorage.setItem('show', JSON.stringify(allShows));
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
  }, [seats, showId, allShows, movie]);

  const selectedShow = allShows.find((s) => s._id === showId);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Booking Summary</h2>

      {seats.length > 0 && selectedShow ? (
        <>
          <div className="d-flex flex-wrap justify-content-between w-100 h-100 mb-4 gap-3">
            <div className="w-50">
              <p><strong>Movie:</strong> {movie?.title || 'N/A'}</p>
              <p><strong>Date:</strong> {formatDate(selectedShow.date)}</p>
              <p><strong>Time:</strong> {formatTime(selectedShow.time)}</p>
              <p><strong>Theatre:</strong> {selectedShow.theatre?.theatre || 'N/A'}</p>
              <p><strong>Screen:</strong> {selectedShow.screen || 'N/A'}</p>
            </div>
            <div>
              <img
                src={movie?.image || ''}
                alt={movie?.title || 'Movie poster'}
                style={{
                  width: 250,
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 8,
                  boxShadow: '0 8px 6px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>

          <div className="mb-3 w-100">
            <strong>Seats:</strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {seats.map((seat) => (
                <span key={seat} className="badge bg-secondary">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-2 d-flex justify-content-between">
            <strong>Ticket Price (each):</strong>
            <span>{formatCurrency(ticketPrice)}</span>
          </div>

          <div className="mb-2 d-flex justify-content-between">
            <strong>Total (before tax):</strong>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          <div className="mb-2 d-flex justify-content-between">
            <strong>Convenience fees (Base ₹30/ticket + 18% GST):</strong>
            <span>{formatCurrency(taxAmount)}</span>
          </div>

          <div className="mb-2 d-flex justify-content-between fw-bold">
            <strong>Total Amount:</strong>
            <span>{formatCurrency(totalAmtWithTax)}</span>
          </div>

          <div>
            <button
              className="bg-primary border rounded p-2 text-white"
              onClick={() => navigate("/PaymentPage")}
            >
              {formatCurrency(totalAmtWithTax)}
              <span className="ms-2">Continue</span>
            </button>
          </div>
        </>
      ) : (
        <p className="text-muted text-center">No seats selected.</p>
      )}
    </div>
  );
};

export default Bookingseats;
