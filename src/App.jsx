import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import { setData } from './Redux/slice/CartSlice';
import { setTheatres } from './Redux/slice/movieSlice';

import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Location from './pages/Location';
import AddShow from './pages/AddShow';
import BookTickets from './pages/BookTickets';
import BookingPage from './pages/BookingPage';
import AuthPage from './components/AuthPage';
// import MoviesView from './pages/MoviesView';
import Bookingseats from './pages/Bookingseats';
import Terms from './pages/Terms';
import PaymentPage from './pages/PaymentPage';
import OrderList from './pages/OrderList';
import OrderDetails from './pages/OrderDetails';

import ProtectedRoute from './components/ProtectedRoute';
import Theatre from './pages/Theatre';

const App = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!token;

  const fetchCustomerData = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/customers/dataForGetting", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setData(res.data));
    } catch (error) {
      console.error("❌ Error fetching customer data:", error);
    }
  };

  const fetchTheatres = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/customers/theatres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setTheatres(res.data));
    } catch (error) {
      console.error("❌ Error fetching theatres:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCustomerData();
      fetchTheatres();
    }
  }, [token]);

  return (
    <div style={{ padding: "10px", fontFamily: 'Arial, sans-serif' }}>
      <Routes>
        {/* <Route path="/" element={<MoviesView />} /> */}
        <Route path="/" element={<Location />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/theatres" element={<Theatre />} />

        <Route
          path="/addshow"
          element={
            <ProtectedRoute
              element={<AddShow />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["admin"]}
              user={user}
            />
          }
        />
        <Route
          path="/movie"
          element={
            <ProtectedRoute
              element={<Movies fetchData={fetchCustomerData} />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["admin"]}
              user={user}
            />
          }
        />
        <Route path="/viewMovies/:id" element={<MovieDetails />} />
        <Route
          path="/book-tickets"
          element={
            <ProtectedRoute
              element={<BookTickets />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["user", "admin"]}
              user={user}
            />
          }
        />
        <Route
          path="/bookingseats/:showId"
          element={
            <ProtectedRoute
              element={<Bookingseats />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["user", "admin"]}
              user={user}
            />
          }
        />
        <Route
          path="/PaymentPage"
          element={
            <ProtectedRoute
              element={<PaymentPage />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["user", "admin"]}
              user={user}
            />
          }
        />
        <Route
          path="/view-tickets"
          element={
            <ProtectedRoute
              element={<BookingPage />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["user", "admin"]}
              user={user}
            />
          }
        />
        <Route
          path="/orderlist"
          element={
            <ProtectedRoute
              element={<OrderList />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["user", "admin"]}
              user={user}
            />
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute
              element={<OrderDetails />}
              isAuthenticated={isAuthenticated}
              allowedRoles={["user", "admin"]}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
