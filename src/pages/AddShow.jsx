import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDate,
  setTime,
  setScreen,
  setPrice,
  setTheatre,
  setShow,
  clearShowForm,
  
} from '../Redux/slice/movieSlice';

import { setTitle } from '../Redux/slice/CartSlice';

const AddShow = () => {
  const dispatch = useDispatch();

  const {
    date,
    time,
    screen,
    price,
    theatre,
    show,
    theatres,

  } = useSelector((state) => state.theatres);

  const { data, title } = useSelector((state) => state.movies);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (error) setError('');
  }, [date, time, screen, price, theatre, title]);

  useEffect(() => {
    if (show && Array.isArray(show) && show.length > 0) {
      const timer = setTimeout(() => dispatch(clearShowForm()), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  const fetchAllShows = async () => {
    
    try {
      
      const res = await axios.get('https://movie-booking-backend-0oi9.onrender.com/api/shows/getShow',{
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setShow(res.data));
    } catch (err) {
      console.error('❌ Failed to fetch shows:', err.response?.data || err.message);
      setError('❌ Failed to fetch shows');
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!title || !theatre || !date || !time || !screen || !price) {
      setError('Please fill all the fields');
      return;
    }

    if (Number(price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('https://movie-booking-backend-0oi9.onrender.com/api/shows/postShow', {
        title,     // movie ObjectId
        theatre,  // theatre ObjectId   
        date,
        time,
        screen,
        price,
      },{
         headers: { Authorization: `Bearer ${token}` }
      });

      await fetchAllShows();
      dispatch(clearShowForm());
      dispatch(setTitle(''))
      console.log('✅ Show added and fetched!');
    } catch (err) {
      console.error('❌ Failed to add show:', err.response?.data || err.message);
      setError('❌ Failed to add show');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundImage: "url('https://pbs.twimg.com/media/GSIQHjGbMAAEB2E.jpg:large')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      ></div>

      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6">
            <div className="card shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
              <div className="card-body">
                <h3 className="card-title text-center mb-4">🎬 Add New Show</h3>

                {/* Movie Title */}
                <div className="mb-3">
                  <label className="form-label">Movie</label>
                  <select
                    value={title}
                    onChange={(e) => dispatch(setTitle(e.target.value))}
                    className="form-select"
                  >
                    <option value="">-- Select Movie --</option>
                    {Array.isArray(data) &&
                      data.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Theatre */}
                <div className="mb-3">
                  <label className="form-label">Theatre</label>
                  <select
                    value={theatre}
                    onChange={(e) => dispatch(setTheatre(e.target.value))}
                    className="form-select"
                  >
                    <option value="">-- Select Theatre --</option>
                    {Array.isArray(theatres) &&
                      theatres.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.theatre}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => dispatch(setDate(e.target.value))}
                    className="form-control"
                  />
                </div>

                {/* Time */}
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => dispatch(setTime(e.target.value))}
                    className="form-control"
                  />
                </div>

                {/* Screen */}
                <div className="mb-3">
                  <label className="form-label">Screen</label>
                  <input
                    type="text"
                    value={screen}
                    onChange={(e) => dispatch(setScreen(e.target.value))}
                    placeholder="Enter screen number"
                    className="form-control"
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => dispatch(setPrice(e.target.value))}
                    placeholder="Enter ticket price"
                    className="form-control"
                  />
                </div>

                {/* Submit */}
                <div className="d-grid">
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Adding Show...' : 'Add Show'}
                  </button>
                </div>

                {/* Alerts */}
                {show && Array.isArray(show) && show.length > 0 && (
                  <div className="alert alert-success mt-3" role="alert">
                    ✅ Show added successfully!
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShow;
