import { createSlice } from '@reduxjs/toolkit';
import { getPopSubredditsList } from '../features/api/reddit.js';

const initialState = {
  status: 'unitialized',
  subreddits: [],
  error: null,
  isMockedData: true,
};

const subredditSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPopSubredditsList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getPopSubredditsList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subreddits = action.payload;
      })
      .addCase(getPopSubredditsList.rejected, (state, action) => {
        state.status = 'failed';
        const { error, meta, payload, type } = action;
        state.error = { error, meta, payload, type };
      });
  },
});

export default subredditSlice.reducer;
export const selectPopSubredditsList = state => state.subreddits.subreddits;

export const selectPopSubredditsListStatus = state => {
  const status = state.subreddits.status;
  return status;
};

export const selectPopSubredditsListError = state => state.subreddits.error;
export const selectPopSubredditsListIsMockedData = state => state.subreddits.isMockedData;
