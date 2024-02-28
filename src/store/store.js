import { configureStore } from "@reduxjs/toolkit";
import subredditReducer from "./subredditSlice";
import subredditPostsReducer from "./subredditPostsSlice";
import subredditCommentsReducer from "./subredditCommentsSlice";

export default configureStore({
        reducer: {
            subreddits: subredditReducer,
            subredditPosts: subredditPostsReducer,
            subredditComments: subredditCommentsReducer
        }
    })
    