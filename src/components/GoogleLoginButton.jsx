import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../Redux/slice/authSlice";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const handleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse || !credentialResponse.credential) return;

      // Send Google ID token to backend
      const res = await axios.post("http://localhost:7000/api/auth/google", {
        token: credentialResponse.credential,
      });

      // Save token & user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch(login(res.data.user));

      // Redirect after login
      window.location.href = "/";
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center my-3">
      <div className="w-100" style={{ maxWidth: "300px" }}>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => alert("Google login failed")}
          size="large" // can be 'medium' or 'large' for better mobile scaling
          width="100%"  // makes button take full width of parent div
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
