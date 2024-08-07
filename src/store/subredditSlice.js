import {createSlice} from "@reduxjs/toolkit";
// import * as toolkit from "@reduxjs/toolkit";
import {getPopSubredditsList} from "../features/api/reddit.js";
// import * as toolkitRaw from '@reduxjs/toolkit';
// const { createSlice } = toolkitRaw.createSlice ?? toolkitRaw;
// const { createSlice } = toolkitRaw.createSlice ?? toolkitRaw;

const initialState = {
    status: 'unitialized',
    subreddits: [],
    error: null
};

const subredditSlice = createSlice({
    name: 'subreddits',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getPopSubredditsList.pending, (state) => {
                state.status = 'loading';
                // console.log('pending action =>', action);
            })
            .addCase(getPopSubredditsList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.subreddits = action.payload;
                // console.log('fulfilled action =>', action);
            })
            .addCase(getPopSubredditsList.rejected, (state, action) => {
                state.status = 'failed';
                // state.subreddits = [];
                // unpack error props
                const {error, meta, payload, type} = action;
                state.error = {error, meta, payload, type};
                // console.log('state.error', state.error);
                // console.log('rejected action =>', action);
                // console.log('state.error => action.error', action.error);
                // console.log('state.error => action.meta', action.meta);
                // console.log('state.error => action.payload', action.payload);
                // console.log('state.error => action.type', action.type);
            })
    },
})

export default subredditSlice.reducer;
export const selectPopSubredditsList = (state) => state.subreddits.subreddits;

export const selectPopSubredditsListStatus = (state) => {
    const status = state.subreddits.status;
    return status;
}

export const selectPopSubredditsListError = (state) => state.subreddits.error;

