import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`https://movie-booking-backend-0oi9.onrender.com/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="text-center mt-5">Loading order details...</div>;

  // Safely access nested objects
  const movie = order.showId?.title || {}; // your backend may store the movie here
  const theatre = order.showId?.theatre || {};
  const showTime = order.showId?.time || '';
  const showDate = order.showId?.date || '';

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Order Details</h2>

      <div className="d-flex flex-wrap justify-content-between mb-4 gap-3">
        <div className="w-50">
          <p><strong>Movie:</strong> {movie.title || 'Unknown Movie'}</p>
          <p><strong>Theatre:</strong> {theatre.theatre || 'Unknown Theatre'}</p>
          <p><strong>City:</strong> {theatre.city || theatre.name || 'Unknown City'}</p>
          <p><strong>Date:</strong> {showDate ? formatDate(showDate) : 'N/A'}</p>
          <p><strong>Time:</strong> {showTime ? formatTime(showTime) : 'N/A'}</p>
          <p><strong>Seats:</strong> {order.seats.join(', ')}</p>
          <p><strong>Total Price:</strong> {formatCurrency(order.totalAmtWithTax)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
        </div>

        <div>
          <img
            src={movie.image || ''}
            alt={movie.title || 'Movie Poster'}
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

      <div className="text-center">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
