import { createSlice } from "@reduxjs/toolkit";
import { getSubredditComments } from "../features/api/reddit";


const initialState = {
    status: 'uninitialized',
    comments: [],
    postId: null,
    error: null,
}

const subredditCommentsSlice = createSlice({
    name: 'subredditComments',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getSubredditComments.pending, (state, action) => {
                state.status = 'loading';
                state.postId = action.meta.arg.postId;
            })
            .addCase(getSubredditComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = action.payload;
            })
            .addCase(getSubredditComments.rejected, (state, action) => {
                state.status = 'failed';
                state.comments = [];
                const { error, meta, payload, type } = action;
                state.error = { message: error.message, meta, payload, type };
            })
    }
});

export default subredditCommentsSlice.reducer;

export const selectSubredditComments = state => state.subredditComments.comments;

export const selectSubredditCommentsStatus = state => state.subredditComments.status;

export const selectSubredditCommentsPostId = state => state.subredditComments.postId;

export const selectSubredditCommentsError = state => state.subredditComments.error;
