import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout()); // Clear Redux state
    localStorage.removeItem("token"); // Remove auth token
    localStorage.removeItem("user");  // Remove stored user info
    navigate("/login"); // Redirect to login page
  }, [dispatch, navigate]);

  return null; // No UI needed
};

export default Logout;
