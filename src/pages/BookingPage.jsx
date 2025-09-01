import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedSeats } from "../Redux/slice/movieSlice";


const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Redux + localStorage fallback
  const showId =
    useSelector((state) => state.theatres?.selectedShowId) ||
    JSON.parse(localStorage.getItem("selectedShowId"));

  const allShows =
    useSelector((state) => state.theatres?.show) ||
    JSON.parse(localStorage.getItem("show") || "[]");

  const selectedSeats =
    useSelector((state) => state.theatres?.selectedSeats) ||
    JSON.parse(localStorage.getItem("selectedSeats") || "[]");

  const [seatLayout, setSeatLayout] = useState(() => {
    const storedLayout = localStorage.getItem("seatLayout");
    return storedLayout ? JSON.parse(storedLayout) : [];
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const TICKET_PRICE = 150;
  const selectedShow = allShows.find((s) => s._id === showId);
  const totalPrice = selectedSeats.length * (selectedShow?.price || TICKET_PRICE);
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch seat layout
  useEffect(() => {
    if (!showId || !token) return;

    const fetchSeatLayout = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://movie-booking-backend-0oi9.onrender.com/api/seats/${showId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSeatLayout(res.data.layout || []);
        localStorage.setItem("seatLayout", JSON.stringify(res.data.layout || []));
      } catch {
        try {
          const createRes = await axios.post(
            "https://movie-booking-backend-0oi9.onrender.com/api/seats/createSeatLayout",
            { showId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSeatLayout(createRes.data.layout || []);
          localStorage.setItem("seatLayout", JSON.stringify(createRes.data.layout || []));
        } catch (error) {
          setMessage("Unable to load or create seat layout.");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSeatLayout();
  }, [showId, token]);

  // Scroll to start when layout loads
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [seatLayout]);

  // Save selected seats to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats || []));
  }, [selectedSeats]);

  const toggleSeat = (seatId) => {
    const updated = selectedSeats.includes(seatId)
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];
    dispatch(setSelectedSeats(updated));
    localStorage.setItem("selectedSeats", JSON.stringify(updated));
  };

  const handleBooking = async () => {
    if (!selectedSeats.length) return;
    setBooking(true);
    try {
      const res = await axios.post(
        `https://movie-booking-backend-0oi9.onrender.com/api/seats/book/${showId}`,
        { selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Booking successful");
      setShowTerms(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const handleOk = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      navigate(`/bookingseats/${showId}`);
    }, 2000);
  };

  const handleCancel = () => {
    setShowTerms(false);
    navigate("/");
  };

  if (!showId) return <p className="p-4 text-danger">No show selected.</p>;
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Loading seat layout...</span>
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="text-center mb-3">Book Your Seats</h2>

      {selectedShow && (
        <p className="text-center mb-2 fw-bold">
          Price per Ticket: ₹{selectedShow.price || TICKET_PRICE}
        </p>
      )}

      {message && <div className="alert alert-info text-center">{message}</div>}

      <div className="text-center mb-3 fw-bold">
        {selectedSeats.length > 0 ? (
          <>Selected: {selectedSeats.join(", ")} | Total: ₹{totalPrice}</>
        ) : (
          <>No seats selected</>
        )}
      </div>

      <div
        ref={scrollRef}
        className="seat-scroll d-flex flex-column align-items-center mb-4"
        style={{ overflowX: "auto", width: "100%", whiteSpace: "nowrap" }}
      >
        {seatLayout.map((row) => (
          <div
            key={row.row}
            className="d-flex align-items-center mb-2"
            style={{ minWidth: "fit-content" }}
          >
            <strong className="me-1" style={{ width: "30px" }}>
              {row.row}
            </strong>
            <div className="d-flex flex-nowrap">
              {row.seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isBooked = seat?.status === "booked"&& !isSelected;

                return (
                  <button
                    key={seat.id}
                    title={isBooked ? "Already booked" : `Seat ${seat.id}`}
                    disabled={isBooked}
                    onClick={() => toggleSeat(seat.id)}
                    className={`btn btn-sm me-1 mb-1 ${
                      isBooked ? "btn-secondary" : isSelected ? "btn-warning" : "btn-success"
                    }`}
                    style={{
                      width: "38px",
                      height: "38px",
                      fontSize: "10px",
                      borderRadius: "6px",
                    }}
                  >
                    {seat.id.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="position-relative mt-4 text-center">
        <div className="bg-primary text-white py-1 mb-2 rounded">Screen This Side</div>

        <button
          className="btn btn-primary fw-bold px-4 py-2"
          onClick={handleBooking}
          disabled={!selectedSeats.length || booking || !seatLayout.length}
        >
          {booking ? "Booking..." : `Proceed ₹${totalPrice}`}
        </button>

        <div className="mt-3 d-flex justify-content-center flex-wrap gap-2">
          <span className="badge bg-success">Available</span>
          <span className="badge bg-warning text-dark">Selected</span>
          <span className="badge bg-secondary">Booked</span>
        </div>
      </div>

      {showTerms && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">Terms and Conditions</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <ul className="small">
                  <li>Mask is compulsory inside the theatre.</li>
                  <li>Entry allowed only for valid ticket holders.</li>
                  <li>Guests under 18 are not allowed in A-rated movies.</li>
                  <li>Children above 3 need tickets for 'U'/'U/A' movies.</li>
                  <li>No duplicate tickets if lost.</li>
                  <li>Tickets once booked are not transferable.</li>
                  <li>Feedback may be requested by the staff.</li>
                  <li>Admission rights reserved.</li>
                  <li>No outside food allowed.</li>
                  <li>Drunken individuals will be denied entry.</li>
                  <li>Prices and schedules subject to change.</li>
                </ul>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-success" onClick={handleOk}>Okay</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirming && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
        >
          <div className="text-center text-white">
            <div className="spinner-border mb-3" role="status" />
            <p>Confirming your booking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
