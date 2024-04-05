import { createSlice } from "@reduxjs/toolkit";
import { getSubredditPosts, getUserAvatar } from "../features/api/reddit";

const initialState = {
    postsStatus: 'uninitialized',
    avatarsStatus: 'uninitialized',
    posts: [],
    avatars: {},
    postsErrorState: null,
    avatarsErrorState: null,
}

const subredditPostsSlice = createSlice({
    name: 'subredditPosts',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getSubredditPosts.pending, (state, action) => {
                state.postsStatus = 'loading';
            })
            .addCase(getSubredditPosts.fulfilled, (state, action) => {
                state.postsStatus = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(getSubredditPosts.rejected, (state, action) => {
                state.postsStatus = 'failed';
                state.posts = [];
                // unpack error props
                const { error, meta, payload, type } = action;
                state.postsErrorState = { message: error.message, meta, payload, type };
                // console.log('state.postsErrorState', state.postsErrorState);
                // console.log('state.error', state.error);
                // console.log('rejected action =>', action);
                // console.log('state.error => action.error', action.error);
                // console.log('state.error => action.meta', action.meta);
                // console.log('state.error => action.payload', action.payload);
                // console.log('state.error => action.type', action.type);
            })
            .addCase(getUserAvatar.pending, (state, action) => {
                state.avatarsStatus = 'loading';

            })
            .addCase(getUserAvatar.fulfilled, (state, action) => {
                state.avatarsStatus = 'succeeded';
                const key = action.payload[0];
                const val = action.payload[1];
                state.avatars[key] = val;
                // console.log('avatar fulfilled', action.payload);
                // console.log('state.avatar', state.avatars);
            })
            .addCase(getUserAvatar.rejected, (state, action) => {
                state.avatarsStatus = 'failed';
                // state.avatars = {};
                const { error, meta, payload, type } = action;
                state.avatarsErrorState = { message: error.message, meta, payload, type };
                // console.log('state.avatarsErrorState', state.avatarsErrorState);
                // console.log(`avatar rejected: ${JSON.stringify(fullError)}`);
                // console.log(`avatar rejected: ${action.error}`);
                // state.avatar = '';
            })
    }
})

export default subredditPostsSlice.reducer;

export const selectSubredditPosts = state => state.subredditPosts.posts;

export const selectSubredditPostsStatus = state => state.subredditPosts.postsStatus;

export const selectSubredditAvatarsStatus = state => state.subredditPosts.avatarsStatus;

export const selectSubredditPostsError = state => state.subredditPosts.postsErrorState;

export const selectSubredditAvatarsError = state => state.subredditPosts.avatarsErrorState;

export const selectUserAvatar = state => state.subredditPosts.avatars;
