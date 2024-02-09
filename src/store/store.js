import { configureStore } from "@reduxjs/toolkit";
// import subredditReducer from "./subredditSlice";
import subredditReducer from "./subredditSlice";
import subredditPostsReducer from "./subredditPostsSlice";

export default configureStore({
        reducer: {
            subreddits: subredditReducer,
            subredditPosts: subredditPostsReducer,
        }
    })