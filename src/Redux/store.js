import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./slice/CartSlice"
import theatreReducer from "./slice/movieSlice"
import authReducer from "./slice/authSlice"

 const store=configureStore(
    {
reducer:
{
    movies:movieReducer,
    theatres:theatreReducer,
    auth: authReducer,
}
    }
)

export default store