import { configureStore } from "@reduxjs/toolkit";
import subredditReducer from "./subredditSlice";

export default configureStore({
        reducer: {
            subreddits: subredditReducer
        }
    })