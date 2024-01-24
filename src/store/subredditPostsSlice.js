import { createSlice } from "@reduxjs/toolkit";
import { getSubredditPosts } from "../features/api/reddit";

const initialState = {
    status: 'uninitialized',
    posts: [],
    error: null,
}

const subredditPostsSlice = createSlice({
        name: 'subredditPosts',
        initialState: initialState,
        reducers: {

        },
        extraReducers: builder => {
            builder
            .addCase(getSubredditPosts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(getSubredditPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(getSubredditPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.posts = [];
                state.error = action.error;
            })
        }
    }
)

export default subredditPostsSlice.reducer;

export const selectSubredditPosts = (state) => {
    const posts = state.subredditPosts.posts;
    // console.log('posts',posts);
    // console.log('posts.map',posts.map(post => post));

    // return posts.map(post => post);
    return posts;
}

export const selectSubredditPostsStatus = (state) => {
    const status = state.subredditPosts.status;
    return status;
}


