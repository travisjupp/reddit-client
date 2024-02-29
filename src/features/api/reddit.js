// filter popular.json

import { createAsyncThunk } from "@reduxjs/toolkit";

// export const apiRoot = 'https://www.reddit.com/';
// export const apiRootTesting = 'http://localhost:8000/';
export const apiRootTesting = 'http://192.168.0.5:8000/';
const subredditsPathName = 'subreddits/1';

// Fetch list of popular subreddits
// Populates the sidebar on first load with https://www.reddit.com/subreddits
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

// Fetch subreddits eg. /r/MapPorn
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

// Fetch subreddit post comments
export const getSubredditComments = createAsyncThunk('subreddits/getSubredditComments',
  async (permalink, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://www.reddit.com${permalink}.json`);
      // const response = await fetch(`https://www.reddit.com/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day.json`);
      if (!response.ok) {
        throw new Error(`HTTP error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
      console.log('json[1].data.children', json[1].data.children);

      // Comments objects can be quite large, this removes replies to replies of comments.
      // We only need comments/replies a few levels deep
      const commentsArr = json[1].data.children;
      for (let comment of commentsArr) {
        // ignore non comment objects of kind: 'more'
        if (comment.kind !== 'more') {
          // if replies property not empty
          if (comment.data.replies !== "") {
            const repliesArr = comment.data.replies.data.children;
            for (let reply of repliesArr) {
              // ignore non comment objects of kind: 'more'
              if (reply.kind !== 'more') {
                // neuter reply by removing replies to a reply
                reply.data.replies = "neutered"
                console.log('reply', reply);
                console.log('comment', comment);
              }
            }
          }
        }


        // console.log('comment',comment);
      }
      console.log('json',json);
      return json[1].data.children;
    } catch (e) {
      console.error('Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
)

// Fetch avatars from user profiles 
export const getUserAvatar = createAsyncThunk('users/getUserAvatar',
  async (userName, { rejectWithValue }) => {
    try {
      // const response = await fetch(`https://www.reddit.com/user/TEST_REDDIT_ERROR_RESPONSE/about.json`);
      const response = await fetch(`${apiRootTesting}user/${userName}`);
      // const response = await fetch(`https://www.reddit.com/user/${userName}/about.json`);
      if (!response.ok) {
        throw new Error(`HTTP error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
      // console.log('json.data.icon_img', json.data.icon_img);
      // return an object
      // return { [userName]: json.data.icon_img }

      // return an array
      return [userName, json.data.icon_img]

      // return a property
      // return [userName]: json.data.icon_img
      // return json.data.icon_img;
    } catch (e) {
      console.error('Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
);