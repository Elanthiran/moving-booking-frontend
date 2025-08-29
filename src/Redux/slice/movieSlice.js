import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem('token');

const initialState = {
  // Movie details
  selectedMovie: null,

  // City & theatre
  cityList: [],
  filteredCities: [],
  searchTerm: '',
  selectedCity: null,
  theatres: [],
  error: '',

  // Show selection
  selectedShowId: null,
  selectedTheatreId: null,
  date: "",
  time: "",
  screen: "",
  price: "",
  theatre: "",
  show: [],

  // Seat selection
  selectedSeats: [],
  seatLayout: [],

  // Pricing
  ticketPrice: 150,
  totalPrice: 0,
  taxAmount: 0,
  totalAmtWithTax: 0,

  // UI and status
  loading: false,
  booking: false,
  message: "",
  showTerms: false,
  confirming: false,
};

const movieSlice = createSlice({
  name: "theatre",
  initialState,
  reducers: {
    // Movie selection
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },

    // City & search
    setCityList(state, action) {
      state.cityList = action.payload || [];
      state.filteredCities = action.payload || [];
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      const term = action.payload.toLowerCase();
      state.filteredCities = (state.cityList || []).filter(city =>
        city.name.toLowerCase().includes(term)
      );
    },
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
    setFilteredCities(state, action) {
      state.filteredCities = action.payload || [];
    },

    // Theatre
    setTheatres(state, action) {
      state.theatres = action.payload || [];
    },

    // Show details
    setDate(state, action) {
      state.date = action.payload;
    },
    setTime(state, action) {
      state.time = action.payload;
    },
    setScreen(state, action) {
      state.screen = action.payload;
    },
    setPrice(state, action) {
      state.price = action.payload;
    },
    setTheatre(state, action) {
      state.theatre = action.payload;
    },
    setSelectedShowId(state, action) {
      state.selectedShowId = action.payload;
    },
    setSelectedTheatreId(state, action) {
      state.selectedTheatreId = action.payload;
    },
    setShow(state, action) {
      state.show = action.payload || [];
    },
    clearShowForm(state) {
      state.date = "";
      state.time = "";
      state.screen = "";
      state.price = "";
      state.theatre = "";
    },
    clearShows(state) {
      state.show = [];
    },

    // Seat & pricing logic
    setSelectedSeats(state, action) {
      state.selectedSeats = action.payload;

      const ticketPrice = state.selectedShowId
        ? (state.show.find(show => show._id === state.selectedShowId)?.price || 150)
        : 150;

      const totalPrice = state.selectedSeats.length * ticketPrice;
      const taxAmount = (totalPrice * 0.18) + (30 * state.selectedSeats.length);
      const totalAmtWithTax = totalPrice + taxAmount;

      state.ticketPrice = ticketPrice;
      state.totalPrice = totalPrice;
      state.taxAmount = taxAmount;
      state.totalAmtWithTax = totalAmtWithTax;
    },

    clearSelectedSeats(state) {
      state.selectedSeats = [];
      state.totalPrice = 0;
      state.taxAmount = 0;
      state.totalAmtWithTax = 0;
    },

    // Error and status
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = '';
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
});

// Export actions
export const {
  setSelectedMovie,
  setCityList,
  setSearchTerm,
  setSelectedCity,
  setFilteredCities,
  setTheatres,
  setDate,
  setTime,
  setScreen,
  setPrice,
  setTheatre,
  setSelectedShowId,
  setSelectedTheatreId,
  setShow,
  clearShowForm,
  clearShows,
  setSelectedSeats,
  clearSelectedSeats,
  setLoading,
  setError,
  clearError,
  setMessage
} = movieSlice.actions;

// Export reducer
export default movieSlice.reducer;

//
// 🔁 Async Thunks
//

export const fetchCities = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(
      'http://localhost:7000/api/customers/city',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
    dispatch(setCityList(sorted));
    dispatch(setFilteredCities(sorted));
    dispatch(setError(""));
  } catch (err) {
    console.error('Error fetching cities:', err);
    dispatch(setError('Failed to fetch cities'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTheatresByCity = (cityName) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `http://localhost:7000/api/customers/theatres?city=${cityName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setTheatres(res.data));
    dispatch(setError(""));
  } catch (err) {
    console.error('Error fetching theatres:', err);
    dispatch(setError('Failed to load theatres'));
    dispatch(setTheatres([]));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchShows = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      "http://localhost:7000/api/shows/getShow",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const now = new Date(); // current date & time

    const validShows = (res.data || []).filter((s) => {
      if (!s.theatre || !s.date || !s.time) return false;

      const showDateTime = new Date(`${s.date}T${s.time}`);
      return showDateTime >= now; // only future shows
    });

    dispatch(setShow(validShows));
    dispatch(setError(""));
  } catch (error) {
    console.error("❌ Failed to fetch shows:", error);
    dispatch(setError("Failed to fetch shows"));
  } finally {
    dispatch(setLoading(false));
  }
 };
