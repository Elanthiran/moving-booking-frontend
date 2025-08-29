import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setSelectedSeats, setSelectedShowId } from '../Redux/slice/movieSlice';
import { formatCurrency } from '../utils/formatters';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');

  // Redux state
  const selectedSeats = useSelector((state) => state.theatres.selectedSeats || []);
  const showId = useSelector((state) => state.theatres.selectedShowId);
  const totalAmtWithTax = useSelector((state) => state.theatres.totalAmtWithTax || 0);

  // Restore state from localStorage on reload
  useEffect(() => {
    const savedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const savedShowId = JSON.parse(localStorage.getItem('selectedShowId'));
    const savedTotal = JSON.parse(localStorage.getItem('totalAmtWithTax'));

    if (savedSeats) dispatch(setSelectedSeats(savedSeats));
    if (savedShowId) dispatch(setSelectedShowId(savedShowId));
    if (savedTotal) localStorage.setItem('totalAmtWithTax', savedTotal);
  }, [dispatch]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('selectedShowId', JSON.stringify(showId));
    localStorage.setItem('totalAmtWithTax', JSON.stringify(totalAmtWithTax));
  }, [selectedSeats, showId, totalAmtWithTax]);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');  
    if (!token) {
      alert('Please login first.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:7000/api/orders',
        {
          showId,
          seats: selectedSeats,
          totalAmtWithTax,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('🎉 Booking successful!');
      dispatch(setSelectedSeats([]));
      localStorage.removeItem('selectedSeats');
      localStorage.removeItem('selectedShowId');
      localStorage.removeItem('totalAmtWithTax');
      navigate('/');
    } catch (error) {
      console.error('❌ Payment failed', error);
      alert('Payment failed.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Confirm Payment</h2>
      <p>Seats: {selectedSeats.join(', ')}</p>
      <p>Total Price: {formatCurrency(totalAmtWithTax)}</p>

      <select
        className="form-select mb-3"
        onChange={(e) => setPaymentMethod(e.target.value)}
        value={paymentMethod}
      >
        <option value="">Select Payment Method</option>
        <option value="gpay">Google Pay</option>
        <option value="phonepe">PhonePe</option>
        <option value="card">Credit/Debit Card</option>
        <option value="upi">UPI</option>
      </select>

      <button
        className="btn btn-success"
        onClick={handlePayment}
        disabled={!paymentMethod || selectedSeats.length === 0}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
