import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchOrders = async () => {
      const res = await axios.get('https://movie-booking-backend-0oi9.onrender.com/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>
      <ul className="list-group">
        {orders.map(order => (
          <li className="list-group-item d-flex justify-content-between" key={order._id}>
            <div>
              <strong>{order?.showId?.title?.title || 'Untitled Movie'}</strong> <br />
              <span>Seats: {order.seats.join(', ')}</span>
            </div>
            <Link to={`/order/${order._id}`} className="btn btn-primary">Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
