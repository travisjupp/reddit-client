import { createSlice } from "@reduxjs/toolkit";
import { getSubredditTitles } from "../features/api/reddit";

const initialState = {
    status: "unitialized",
    subreddits: [],
    error: null
};

const subredditSlice = createSlice({
    name: 'subreddits',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getSubredditTitles.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(getSubredditTitles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.subreddits = action.payload;
            })
            .addCase(getSubredditTitles.rejected, (state, action) => {
                state.status = 'failed';
                state.subreddits = [];
                state.error = action.error;
            })
    }
}
)

export default subredditSlice.reducer;
export const selectSubredditTitles = (state) => state.subreddits.subreddits;

// console.log('selectSubredditTitles()',selectSubredditTitles())
