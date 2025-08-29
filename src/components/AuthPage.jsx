import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";

const AuthPage = ({ inlineMode = false, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register States
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("https://movie-booking-backend-0oi9.onrender.com/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(login(res.data.user));

      if (inlineMode && onClose) {
        onClose();
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !registerEmail || !registerPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("https://movie-booking-backend-0oi9.onrender.com/api/auth/register", {
        username,
        email: registerEmail,
        password: registerPassword,
        role,
      });

      alert("Registration successful. You can now login.");
      setShowLogin(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div
      className={`${inlineMode ? "" : "vh-100"} d-flex justify-content-center align-items-center`}
      style={{
        backgroundImage: inlineMode
          ? "none"
          : `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url()`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1rem",
      }}
    >
      <div
        className="w-100 w-sm-75 w-md-50 bg-dark rounded shadow p-4 p-md-5"
        style={{ maxWidth: "450px" }}
      >
        {inlineMode && (
          <div className="text-end mb-2">
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
        )}

        {showLogin ? (
          <>
            <h3 className="text-primary text-center mb-4">Login</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <button className="btn btn-primary w-100 mb-2" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <GoogleLoginButton />

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <span
                  className="text-success text-decoration-underline"
                  role="button"
                  onClick={() => { setShowLogin(false); setErrorMsg(""); }}
                >
                  Register here
                </span>
              </p>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-success text-center mb-4">Register</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-3">
                <label>Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="btn btn-success w-100" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <p className="text-center mt-3">
                Already have an account?{" "}
                <span
                  className="text-primary text-decoration-underline"
                  role="button"
                  onClick={() => { setShowLogin(true); setErrorMsg(""); }}
                >
                  Login here
                </span>
              </p>
            </form>
          </>
        )}

        {errorMsg && <div className="alert alert-danger mt-3 text-center">{errorMsg}</div>}
      </div>
    </div>
  );
};

export default AuthPage;
