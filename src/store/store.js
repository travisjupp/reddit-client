import { configureStore } from "@reduxjs/toolkit";
import subredditReducer from "./subredditSlice.js";
import subredditPostsReducer from "./subredditPostsSlice.js";
import subredditCommentsReducer from "./subredditCommentsSlice.js";

export default configureStore({
        reducer: {
            subreddits: subredditReducer,
            subredditPosts: subredditPostsReducer,
            subredditComments: subredditCommentsReducer
        }
    })
    