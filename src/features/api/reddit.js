import { createAsyncThunk } from '@reduxjs/toolkit';

export const apiRootTesting = 'http://192.168.0.5:8000/';
const subredditsPathName = 'subreddits/1';

// reset session storage
sessionStorage.clear();
console.log('session storage cleared');

async function fetchThrottle(url, caller, signal) {
  // We mainly throttle requests for user avatars since this hits the endpoint the most frequently. Since user avatars aren't integral (any avatars not loaded with be shimmed with an identicon), a _pseudo_ fetch-queue delays each request. Each call to `fetchThrottle` from `getUserAvatar` adds its delay to the `delayTime` which is ultimately cleared out with `rateLimitReset` and any other session storage items. 

  let delayTime = Number(sessionStorage.getItem('delayTime'));
  let delay = (ms) => new Promise(res => setTimeout(res, ms));
  let numRequests = Number(sessionStorage.getItem('numRequests'));
  // set rate limit reset time for one minute from now on first request
  if (numRequests === 1) {
    sessionStorage.setItem('rateLimitReset', new Date().getTime() + 60000);
    // one minute from now clear session storage 
    setTimeout(() => {
      console.log('clearing session storage');
      sessionStorage.clear();
    }, 60000)
  }
  // has the rate-limit reset?
  // const isLimitReset = new Date().getTime() > Number(sessionStorage.getItem('rateLimitReset'));

  // log number of fetch requests
  sessionStorage.setItem('numRequests', ++numRequests);

  if (caller === 'avatar') {
    sessionStorage.setItem('delayTime', delayTime += 1000);
    // console.log('delayTime',delayTime);
    await delay(delayTime);
    return fetch(url, {signal});
  } else {
    return fetch(url);
  }
}

// Fetch list of popular subreddits
// Populates the sidebar on first load with https://www.reddit.com/subreddits
export const getPopSubredditsList = createAsyncThunk('subreddits/getPopSubredditsList',
  async (_, {rejectWithValue}) => {
    try {
      // const response = await fetch(`https://www.reddit.com/TEST_REDDIT_ERROR_RESPONSE.json`);
      // const response = await fetch('https://www.reddit.com/subreddits.json');
      // const response = await fetchThrottle('https://www.reddit.com/subreddits.json');
      const response = await fetchThrottle(`${apiRootTesting}${subredditsPathName}`, 'pops');
      console.log('res =>', response);
      if (!response.ok) {
        throw new Error(`HTTP error!\nStatus: ${response.status}\nCause: ${response.statusText}\nURL: ${response.url}`);
      }
      const json = await response.json();
      return json.data.children;
    } catch (e) {
      console.error('Error:', e.message);
      return rejectWithValue(e.message);
    }
  }
);

// Fetch subreddits eg. /r/MapPorn
export const getSubredditPosts = createAsyncThunk('subreddits/getSubredditPosts',
  async (path, {rejectWithValue}) => {
    try {
      // const response = await fetch(`https://www.reddit.com/r/TEST_REDDIT_ERROR_RESPONSE.json`);
      // const response = await fetchThrottle(`https://www.reddit.com/r/${path}.json`, 'posts');
      // const response = await fetch(`${apiRootTesting}r/MapPorn`);`
      const response = await fetchThrottle(`${apiRootTesting}r/${path}`, 'posts');
      // const response = await fetch(`${apiRootTesting}r/${path}`);
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
  async ({permalink}, {rejectWithValue}) => {
    console.log('permalink', permalink);
    try {
      const response = await fetchThrottle(`https://www.reddit.com${permalink}.json`, 'comments');
      // const response = await fetch(`https://www.reddit.com${permalink}.json`);
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
  async (postAuthor, {rejectWithValue, signal}) => {
    try {
      // avoid (re)dispatching deleted/undefined profiles
      if (postAuthor === '[deleted]' || postAuthor === undefined) {
        return ['[deleted]', 'PROFILE_DELETED_NO_AVATAR_DATA'];
      }
      // const response = await fetch(`https://www.reddit.com/user/TEST_REDDIT_ERROR_RESPONSE/about.json`);
      // const response = await fetch(`${apiRootTesting}user/${userName}`);
      // const response = await fetch(`BAD_URL`);
      // const response = await fetch(`http://httpstat.us/429`);
      // const response = await fetch(`https://www.reddit.com/user/${userName}/about.json`);
      // const response = await fetchWithDelay(`https://www.reddit.com/user/${userName}/about.json`);
      const response = await fetchThrottle(`https://www.reddit.com/user/${postAuthor}/about.json`, 'avatar', signal);

      if (!response?.ok) {
        throw new Error(`getUserAvatar HTTP error!\nStatus: ${response?.status}\nCause: ${response?.statusText}\nURL: ${response?.url}`);
      }
      const profile = await response.json();

      // avoid (re)dispatching suspended profiles
      return profile.data.is_suspended ? [postAuthor, 'PROFILE_SUSPENDED_NO_AVATAR_DATA'] :
        [postAuthor, profile.data.icon_img]
    } catch (e) {
      console.error('Avatar Error:', postAuthor, e.message);
      return rejectWithValue(e.message);
    }
  },
  {
    condition(postAuthor, {getState}) {
      const state = getState();
      const avatars = state.subredditPosts.avatars;
      // if (!avatars[postAuthor] && postAuthor !== undefined) {
      //   console.log('avatar not cached => ', postAuthor);
      // }
      if (avatars[postAuthor]) { // if avatar is cached cancel thunk
        console.log('aborting =>', postAuthor);
        return false;
      }
    }
  }
);
