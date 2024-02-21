import { createSlice } from "@reduxjs/toolkit";
import { getPopSubredditsList } from "../features/api/reddit";


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
            .addCase(getPopSubredditsList.pending, (state, action) => {
                state.status = 'loading';
                console.log('pending action =>', action);
            })
            .addCase(getPopSubredditsList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.subreddits = action.payload;
                console.log('fulfilled action =>', action);
            })
            .addCase(getPopSubredditsList.rejected, (state, action) => {
                state.status = 'failed';
                state.subreddits = [];
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
    },
})

export default subredditSlice.reducer;
export const selectPopSubredditsList = (state) => state.subreddits.subreddits;

// export const selectPopSubredditTitles = (state) => {
//     const data = state.subreddits.subreddits;
//     return data.map(subreddit => [subreddit.data.title, subreddit.data.url, subreddit.data.icon_img]);
// };


export const selectPopSubredditsListStatus = (state) => {
    const status = state.subreddits.status;
    return status;
}

export const selectPopSubredditsListError = (state) => state.subreddits.error;

