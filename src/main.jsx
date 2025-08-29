import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import store from './Redux/store.js';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      {/* 👇 Wrap App with GoogleOAuthProvider */}
      <GoogleOAuthProvider clientId="77023421990-bdlhbp8enokkki983inm526t1h99gc2t.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </Router>
);
