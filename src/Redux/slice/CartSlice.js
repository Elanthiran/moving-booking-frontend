import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  movies:[],
  title: "",
  genre: "",
  image: "",
  trailerUrl: "",
  releaseDate: "",
  summary:"",
  error: "",
};

const CartSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setTrailerUrl: (state, action) => {
      state.trailerUrl = action.payload;
    },
    setReleaseDate: (state, action) => {
      state.releaseDate = action.payload;
    },
     setSummary: (state, action) => {
      state.summary = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
      setMovies(state, action) {
      state.theatres = action.payload || [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    
  },
});

export const {
  setTitle,
  setGenre,
  setImage,
  setTrailerUrl,
  setReleaseDate,
  setData,
  setError,
  setSummary
} = CartSlice.actions;

export default CartSlice.reducer;
