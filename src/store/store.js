import { configureStore } from "@reduxjs/toolkit";
import subredditReducer from "./subredditSlice";
import subredditPostsSlice from "./subredditPostsSlice";

export default configureStore({
        reducer: {
            subreddits: subredditReducer,
            subredditPosts: subredditPostsSlice,
        }
    })