

import { createAsyncThunk } from '@reduxjs/toolkit';
// import * as toolkit from "@reduxjs/toolkit";

// import * as toolkitRaw from '@reduxjs/toolkit';
// const { createAsyncThunk } = toolkitRaw.default ?? toolkitRaw;
// const { createAsyncThunk } = toolkitRaw;

import axios from 'axios';


// export const apiRoot = 'https://www.reddit.com/';
// export const apiRootTesting = 'http://localhost:8000/';
export const apiRootTesting = 'http://192.168.0.5:8000/';
const subredditsPathName = 'subreddits/1';
const options = {
  // mode: "cors"
}


const t0 = performance.now();
function fetchWithDelay(url, delay = 1000) { // delay must be at least a second or setTimeout will resolve before fetch is done
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => resolve(response))
      .catch(error => reject(error));
    setTimeout(() => {
      const t1 = performance.now();
      // console.log(`Call took ${t1 - t0} milliseconds.`);
      resolve(null); // Resolve after the delay even if fetch fails
    }, delay);
  });
}



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
      // const response = await fetch(`${apiRootTesting}r/MapPorn`);`
      const response = await fetch(`${apiRootTesting}r/${path}`);
      if (!response.ok) {
        throw new Error(`getSubredditPosts HTTP Error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
      return json.data.children;
    } catch (e) {
      console.error('Posts Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
);

// Fetch subreddit post comments
export const getSubredditComments = createAsyncThunk('subreddits/getSubredditComments',
  async ({ permalink, postId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://www.reddit.com${permalink}.json`);
      if (!response.ok) {
        throw new Error(`getSubredditComments HTTP error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
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
              }
            }
          }
        }
      }
      return commentsArr;
    } catch (e) {
      console.error('Comments Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
)

// Fetch avatars from user profiles 
export const getUserAvatar = createAsyncThunk('users/getUserAvatar',
  async (userName, { rejectWithValue }) => {
    //  --------------------------------try/catch-------------------------------
    // try {
    //   // avoid (re)dispatching deleted/undefined profiles
    //   if (userName === '[deleted]' || userName === undefined) {
    //     return ['[deleted]', 'PROFILE_DELETED_NO_AVATAR_DATA'];
    //   }
    //   // const response = await fetch(`https://www.reddit.com/user/TEST_REDDIT_ERROR_RESPONSE/about.json`);
    //   // const response = await fetch(`${apiRootTesting}user/${userName}`);
    //   // const response = await fetch(`BAD_URL`);
    //   // const response = await fetch(`http://httpstat.us/429`);
    //   const response = await fetch(`https://www.reddit.com/user/${userName}/about.json`);
    //   // const response = await fetchWithDelay(`https://www.reddit.com/user/${userName}/about.json`);
    //   if (!response?.ok) {
    //     console.log('response?.status',response?.status);
    //     throw new Error(`getUserAvatar HTTP error!\nStatus: ${response?.status}\nCause: ${response?.statusText}\nURL: ${response?.url}`);
    //   }
    //   const profile = await response.json();
    //   // avoid (re)dispatching suspended profiles
    //   return profile.data.is_suspended ? [userName, 'PROFILE_SUSPENDED_NO_AVATAR_DATA'] :
    //     [userName, profile.data.icon_img]
    // } catch (e) {
    //   console.error('Avatar Error:', userName, e.message);
    //   return rejectWithValue(e.message);
    // }
    //  --------------------------------then/catch-------------------------------

    //   return fetch(`https://www.reddit.com/user/${userName}/about.json`,
    //   // {'mode': 'no-cors'}
    // )
    //     .then(response => {
    //       console.log('response', response);
    //         if (response.ok) {
    //         return response.json();
    //         }
    //         return Promise.reject(response);
    //     })
    //     .then(profile => {
    //       console.log('profile', userName, profile);
    //       if (userName === '[deleted]' || userName === undefined) {
    //         return ['[deleted]', 'PROFILE_DELETED_NO_AVATAR_DATA'];
    //       }
    //       return profile.data.is_suspended ? [userName, 'PROFILE_SUSPENDED_NO_AVATAR_DATA'] :
    //         [userName, profile.data.icon_img];
    //     })
    //     .catch(
    //       response => {
    //         console.log('error', userName);
    //         console.log('response.status',response.status, 'response.statusText',  response.statusText );
    //         response.json().then(json => {
    //           console.log('json',json);
    //         })
    //         return ['FailedFetch', 'FailedFetch']
    //       }
    //     )
    //  -----------------------------------axios----------------------------------

    try {
      const response = await axios.get(`https://www.reddit.com/user/${userName}/about.json`);
      console.log('axios response', response);
      

      axios.interceptors.response.use(function (response) {
        // Do something with response data
        console.log('intercept response', response);
        // return response;
      }, function (error) {
        // Do something with response error
        console.log('intercept error', error);
        return Promise.reject(error);
      });
      if (userName === '[deleted]' || userName === undefined) {
        return ['[deleted]', 'PROFILE_DELETED_NO_AVATAR_DATA'];
      }

      return response.data.data.is_suspended ? [userName, 'PROFILE_SUSPENDED_NO_AVATAR_DATA'] :
        [userName, response.data.data.icon_img];
    } catch (e) {
      console.log('axios error', e);
      console.log('axios X-Ratelimit-Remaining', e.response.headers.get('X-Ratelimit-Remaining'));
      console.log('axios error status', e.response.data.error);
      console.log('axios error headers toJSON', e.response.headers.toJSON());
      // return ['failedFetch', 'FailedFetch']
      return rejectWithValue(e.message);
    }



  }
);