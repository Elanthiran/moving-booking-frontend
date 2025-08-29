import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedShowId,
  fetchShows,
  setSelectedCity,
  setSelectedMovie,
  setTheatres,
  setShow,
} from "../Redux/slice/movieSlice";
import { useNavigate } from "react-router-dom";

const Theatre = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const show = useSelector((state) => state.theatres?.show || []);
  const theatres = useSelector((state) => state.theatres?.theatres || []);
  const selectedMovie = useSelector((state) => state.theatres?.selectedMovie);
  const selectedCity = useSelector((state) => state.theatres?.selectedCity);

  // ✅ Load selectedDate from localStorage
  const storedDate = localStorage.getItem("selectedDate");
  const [selectedDate, setSelectedDate] = useState(
    storedDate ? JSON.parse(storedDate) : ""
  );

  // ✅ Restore saved state from localStorage
  useEffect(() => {
    const city = JSON.parse(localStorage.getItem("selectedCity"));
    const movie = JSON.parse(localStorage.getItem("selectedMovie"));
    const savedTheatres = JSON.parse(localStorage.getItem("theatres"));
    const savedShows = JSON.parse(localStorage.getItem("show"));
    const savedShowId = JSON.parse(localStorage.getItem("selectedShowId"));

    if (city) dispatch(setSelectedCity(city));
    if (movie) dispatch(setSelectedMovie(movie));
    if (savedTheatres) dispatch(setTheatres(savedTheatres));
    if (savedShows) dispatch(setShow(savedShows));
    if (savedShowId) dispatch(setSelectedShowId(savedShowId));
  }, [dispatch]);

  // ✅ Fetch shows if empty
  useEffect(() => {
    if (show.length === 0) {
      dispatch(fetchShows()); 
    }
  }, [dispatch, show.length]);

  // ✅ Save to localStorage whenever state changes
  useEffect(() => {
    if (selectedCity)
      localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
    if (selectedMovie)
      localStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
    if (selectedDate)
      localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
    if (theatres.length > 0)
      localStorage.setItem("theatres", JSON.stringify(theatres));
    if (show.length > 0) localStorage.setItem("show", JSON.stringify(show));
  }, [selectedCity, selectedMovie, selectedDate, theatres, show]);

  // --- Helpers ---
  const normalizeDate = (dateStr) =>
    new Date(dateStr).toISOString().split("T")[0];

  const formatDate = (dateStr) =>
    new Date(dateStr)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", "");

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- Filtering ---
  const filteredShowsByMovie = useMemo(() => {
    if (!selectedMovie?._id) return [];
    return show.filter((s) => s.title?._id === selectedMovie._id);
  }, [show, selectedMovie]);

  const uniqueDates = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const futureDates = filteredShowsByMovie
      .map((s) => s.date)
      .filter((date) => new Date(date).setHours(0, 0, 0, 0) >= today)
      .map(normalizeDate);

    return Array.from(new Set(futureDates)).sort();
  }, [filteredShowsByMovie]);

  // ✅ Auto-select first date if none
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  // ✅ Show only theatres matching city + selectedDate
  const visibleTheatres = useMemo(() => {
    if (!selectedCity) return [];

    return theatres.filter(
      (theatre) =>
        theatre.name?.toLowerCase().trim() ===
          selectedCity.name?.toLowerCase().trim() &&
        filteredShowsByMovie.some(
          (s) =>
            s.theatre?._id === theatre._id &&
            normalizeDate(s.date) === selectedDate
        )
    );
  }, [theatres, filteredShowsByMovie, selectedCity, selectedDate]);

  return (
    <div className="container py-4">
      {/* Date Filter */}
      {uniqueDates.length > 0 && (
        <div className="mb-4">
          <label className="form-label fw-bold me-3">Filter by Date:</label>
          {uniqueDates.map((date) => (
            <button
              key={date}
              type="button"
              className={`btn btn-sm me-2 ${
                selectedDate === date ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      )}

      {/* Theatre List */}
      {visibleTheatres.length === 0 ? (
        <p>
          No theatres available in {selectedCity?.name} for the selected date.
        </p>
      ) : (
        visibleTheatres.map((theatre) => {
          const showsForTheatre = filteredShowsByMovie
            .filter(
              (s) =>
                s.theatre?._id === theatre._id &&
                normalizeDate(s.date) === selectedDate
            )
            .sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div key={theatre._id} className="mb-4 pb-3 border-bottom">
              <h4 className="mb-3">{theatre.theatre}</h4>
              <div className="d-flex flex-column gap-2">
                {showsForTheatre.map((item) => (
                  <div key={item._id}>
                    <div className="fw-bold">Screen: {item.screen}</div>
                    <button
                      className="btn btn-outline-dark btn-sm w-auto mt-1"
                      onClick={() => {
                        dispatch(setSelectedShowId(item._id));
                        localStorage.setItem(
                          "selectedShowId",
                          JSON.stringify(item._id)
                        );
                        navigate(`/view-tickets`);
                      }}
                    >
                      {formatTime(item.time)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Theatre;
