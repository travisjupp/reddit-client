// filter popular.json

import { createAsyncThunk } from "@reduxjs/toolkit";

// export const apiRoot = 'https://www.reddit.com/';
export const apiRootTesting = 'http://localhost:8000/';
const subredditsPathName = 'subreddits/1';

export const getPopSubredditsList = createAsyncThunk('subreddits/getPopSubredditsList',
  async () => {
    try {
      //  const response = await fetch('https://www.reddit.com/subreddits.json');
      // const response = await fetch('http://localhost:8000/subreddits/1');
      const response = await fetch(`${apiRootTesting}${subredditsPathName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      // console.log('json.data.children', json.data.children);
      return json.data.children;
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
);

export const getSubredditPosts = createAsyncThunk('subreddits/getSubredditPosts',
  async (path) => {
    try {
      
      // const response = await fetch(`https://www.reddit.com/r/${path}.json`);
      // const response = await fetch('http://localhost:8000/posts/3');
      const response = await fetch(`${apiRootTesting}posts/3`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      // console.log('json.data.children', json.data.children);
      return json.data.children;
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
);