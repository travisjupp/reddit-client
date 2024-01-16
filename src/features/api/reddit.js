// filter popular.json

import { createAsyncThunk } from "@reduxjs/toolkit";

export const apiRoot = 'http://localhost:8000';
const subredditsPathName = '/subreddits/1';

// MAKE THIS A THUNK AND IMPORT INTO SUBREDDITSLICE
// returns nested arrays of subreddit titles and urls
export const getSubredditTitles = createAsyncThunk('subreddits/getSubredditTitles',

  async () => {
    try {
      //  const response = await fetch('https://www.reddit.com/subreddits.json');
      // const response = await fetch('http://localhost:8000/subreddits/1');
      const response = await fetch(`${apiRoot}${subredditsPathName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json.data.children.map(subreddit => [subreddit.data.title, subreddit.data.url, subreddit.data.icon_img]));
      // returns subredditArray in the form of [[title, url, icon],[title, url, icon],[title, url, icon]...]
      return json.data.children.map(subreddit => [subreddit.data.title, subreddit.data.url, subreddit.data.icon_img]);
    } catch (e) {
      console.error('error', e);
      console.error('Error message', e.message);
    }
  }


)




//  console.log('./popular.json'.json());
//  fetch('http://localhost:3000/data/popular.json')
//  .then((response) => {
//      console.log('response =>', response);
//      response.json()
//  })
//  .then((json) => console.log('json =>',json));