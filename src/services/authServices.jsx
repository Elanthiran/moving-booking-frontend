// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:7000/api/auth/';

const register = (username, email, password, role) => {
  return axios.post(API_URL + 'register', { username, email, password, role });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

const logout = () => {
  return axios.post(API_URL + 'logout');
};

export default { register, login, logout };
