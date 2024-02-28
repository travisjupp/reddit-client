import { createSlice } from "@reduxjs/toolkit";
import { getSubredditPosts, getUserAvatar } from "../features/api/reddit";

const initialState = {
    status: 'uninitialized',
    posts: [],
    avatars: {},
    error: null,
}

const subredditPostsSlice = createSlice({
    name: 'subredditPosts',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getSubredditPosts.pending, (state, action) => {
                state.status = 'loading';
                // console.log('pending action =>', action);
            })
            .addCase(getSubredditPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
                // console.log('fulfilled action =>', action);
            })
            .addCase(getSubredditPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.posts = [];
                // unpack error props
                const { error, meta, payload, type } = action;
                state.error = { error, meta, payload, type };
                // console.log('state.error', state.error);
                // console.log('rejected action =>', action);
                // console.log('state.error => action.error', action.error);
                // console.log('state.error => action.meta', action.meta);
                // console.log('state.error => action.payload', action.payload);
                // console.log('state.error => action.type', action.type);
            })
            .addCase(getUserAvatar.pending, (state, action) => {
                // console.log('avatar pending')
            })
            .addCase(getUserAvatar.fulfilled, (state, action) => {
                // state.avatar = action.payload;
                const key = action.payload[0];
                const val = action.payload[1];
                state.avatars[key] = val;
                // console.log('avatar fulfilled', action.payload);
                // console.log('state.avatar', state.avatars);
            })
            .addCase(getUserAvatar.rejected, (state, action) => {
                const { error, meta, payload, type } = action;
                const fullError = { error, meta, payload, type }
                // console.log(`avatar rejected: ${JSON.stringify(fullError)}`);
                // console.log(`avatar rejected: ${action.error}`);
                // state.avatar = '';
            })
    }
})

export default subredditPostsSlice.reducer;

export const selectSubredditPosts = state => state.subredditPosts.posts;

export const selectSubredditPostsStatus = state => state.subredditPosts.status;

export const selectSubredditPostsError = state => state.subredditPosts.error;

export const selectUserAvatar = state => state.subredditPosts.avatars;
