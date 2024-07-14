import { createSlice } from "@reduxjs/toolkit";
// import * as toolkit from "@reduxjs/toolkit";
import { getSubredditPosts, getUserAvatar } from "../features/api/reddit.js";
// import * as toolkitRaw from '@reduxjs/toolkit';
// const { createSlice } = toolkitRaw.createSlice ?? toolkitRaw;
// const { createSlice } = toolkitRaw;

const initialState = {
    postsStatus: 'uninitialized',
    avatarsStatus: 'uninitialized',
    posts: [],
    postsOb: {},
    isFiltered: false,
    postsTemp: [],
    avatars: {},
    postsErrorState: null,
    avatarsErrorState: null,
}

const subredditPostsSlice = createSlice({
    name: 'subredditPosts',
    initialState,
    reducers: {
        filterPosts(state, action) {
            const query = action.payload;
            const filteredPosts = state.postsTemp.filter(post =>
                post.data.title.toLowerCase().includes(query.toLowerCase()));
            state.isFiltered = true; // flag isFiltered on
            state.posts = filteredPosts; // show filtered posts
        },
        unfilterPosts(state) {
            state.isFiltered = false;
            state.posts = state.postsTemp;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getSubredditPosts.pending, (state) => {
                state.postsStatus = 'loading';
            })
            .addCase(getSubredditPosts.fulfilled, (state, action) => {
                state.postsStatus = 'succeeded';
                console.log('action.meta',action.meta);
                state.posts = action.payload;
                state.postsOb.current = action.meta.arg;
                state.postsOb[action.meta.arg] = action.payload;
                state.postsTemp = state.posts;
            })
            .addCase(getSubredditPosts.rejected, (state, action) => {
                state.postsStatus = 'failed';
                console.log('thunk rejected =>', action.meta.arg);
                state.postsOb.current = action.meta.arg;
                // state.posts = [];
                // unpack error props
                const { error, meta, payload, type } = action;
                state.postsErrorState = { message: error.message, meta, payload, type };
            })
            .addCase(getUserAvatar.pending, (state) => {
                state.avatarsStatus = 'loading';

            })
            .addCase(getUserAvatar.fulfilled, (state, action) => {
                state.avatarsStatus = 'succeeded';
                const key = action.payload[0];
                const val = action.payload[1];
                state.avatars[key] = val;
            })
            .addCase(getUserAvatar.rejected, (state, action) => {
                state.avatarsStatus = 'failed';
                // unpack error props
                const { error, meta, payload, type } = action;
                state.avatarsErrorState = { message: error.message, meta, payload, type };
            })
    }
})

export const {filterPosts, unfilterPosts} = subredditPostsSlice.actions;

export default subredditPostsSlice.reducer;

export const selectSubredditPosts = state => state.subredditPosts.posts;

export const selectSubredditPostsOb = state => state.subredditPosts.postsOb;

export const selectSubredditPostsStatus = state => state.subredditPosts.postsStatus;

export const selectSubredditAvatarsStatus = state => state.subredditPosts.avatarsStatus;

export const selectSubredditPostsError = state => state.subredditPosts.postsErrorState;

export const selectSubredditAvatarsError = state => state.subredditPosts.avatarsErrorState;

export const selectUserAvatars = state => state.subredditPosts.avatars;

export const selectIsPostsFiltered = state => state.subredditPosts.isFiltered;
