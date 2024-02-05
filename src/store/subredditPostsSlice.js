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
                console.log('pending action =>', action);
            })
            .addCase(getSubredditPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
                console.log('fulfilled action =>', action);
            })
            .addCase(getSubredditPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.posts = [];
                state.error = action.error;
                console.log('rejected action =>', action);
            })
        }
    })

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

export const selectSubredditPostsError = (state) => state.subredditPosts.error;

