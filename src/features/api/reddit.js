// filter popular.json

import { createAsyncThunk } from "@reduxjs/toolkit";

// export const apiRoot = 'https://www.reddit.com/';
export const apiRootTesting = 'http://localhost:8000/';
const subredditsPathName = 'subreddits/1';

export const getPopSubredditsList = createAsyncThunk('subreddits/getPopSubredditsList',
  async (_, { rejectWithValue }) => {
    try {
      // const response = await fetch(`https://www.reddit.com/TEST_REDDIT_ERROR_RESPONSE.json`);
      // const response = await fetch('https://www.reddit.com/subreddits.json');
      // const response = await fetch('http://localhost:8000/subreddits/1');
      const response = await fetch(`${apiRootTesting}${subredditsPathName}`);
      if (!response.ok) {
        throw new Error(`HTTP error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
      // console.log('json.data.children', json.data.children);
      return json.data.children;
    } catch (e) {
      console.error('Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
);

export const getSubredditPosts = createAsyncThunk('subreddits/getSubredditPosts',
  async (path, { rejectWithValue }) => {
    try {

      // const response = await fetch(`https://www.reddit.com/r/TEST_REDDIT_ERROR_RESPONSE.json`);
      // const response = await fetch(`https://www.reddit.com/r/${path}.json`);
      // const response = await fetch('http://localhost:8000/posts/3');
      const response = await fetch(`${apiRootTesting}r/${path}`);
      if (!response.ok) {
        // console.error(response.status);
        // console.error(response.statusText);
        // console.error(response.body);
        // console.error(response.type);
        // console.error(response.url);
        // console.error(response.headers);
        // for (const pair of response.headers.entries()) {
        //   console.log(`${pair[0]}: ${pair[1]}`);
        // }
        throw new Error(`HTTP error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(response.body);
      // console.log(response.type);
      // console.log(response.url);
      // console.log(response.headers);
      // for (const pair of response.headers.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }
      // console.log('json.data.children', json.data.children);
      return json.data.children;
    } catch (e) {
      console.error('Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
);