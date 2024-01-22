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
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(getPopSubredditsList.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(getPopSubredditsList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.subreddits = action.payload;
            })
            .addCase(getPopSubredditsList.rejected, (state, action) => {
                state.status = 'failed';
                state.subreddits = [];
                state.error = action.error;
            })
    }
}
)

export default subredditSlice.reducer;
export const selectPopSubreddits = (state) => state.subreddits.subreddits;

// export const selectPopSubredditTitles = (state) => {
//     const data = state.subreddits.subreddits;
//     return data.map(subreddit => [subreddit.data.title, subreddit.data.url, subreddit.data.icon_img]);
// };

export const selectPopSubredditTitles = (state) => {
    const data = state.subreddits.subreddits;
    return data.map(subreddit => {

    return {title: subreddit.data.title, url: subreddit.data.url, icon: subreddit.data.icon_img}
    }
        );
};

