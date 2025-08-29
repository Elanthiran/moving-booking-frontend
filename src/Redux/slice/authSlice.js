import { createSlice } from '@reduxjs/toolkit';

// Initial state for auth
const initialState = {
  user: null, // Initially, no user is logged in
  isLoading: false, // Track if there are loading states (for example, during login or data fetch)
  error: null, // To handle errors, if any
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // Action payload should be the user data
      state.user = action.payload; // Store user data in state
      state.isLoading = false; // Set loading to false after login
    },
    logout: (state) => {
      state.user = null; // Reset the user to null upon logout
      state.isLoading = false; // Set loading to false on logout
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload; // Update loading state
    },
    setError: (state, action) => {
      state.error = action.payload; // Set an error message
    },
  },
});

export const { login, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
