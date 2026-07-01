import { createAsyncThunk } from '@reduxjs/toolkit';

// Json-Server settings
export const apiRootTesting = 'http://192.168.0.5:8000/';
// const subredditsPathName = 'subreddits/1';

// Reset session storage
sessionStorage.clear();
console.log('session storage cleared');

async function fetchThrottle(
  url,
  caller,
  opts = { signal: null, isMockedData: false },
) {
  let { signal, isMockedData } = opts;
  isMockedData = isMockedData.toString();
  // We mainly throttle requests for user avatars since this hits the endpoint the most frequently. Since user avatars aren't integral (any avatars not loaded with be shimmed with an identicon), a _pseudo_ fetch-queue delays each request. Each call to `fetchThrottle` from `getUserAvatar` adds its delay to the `delayTime` which is ultimately cleared out with `rateLimitReset` and any other session storage items.

  const delayTime = Number(sessionStorage.getItem('delayTime'));
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let numRequests = Number(sessionStorage.getItem('numRequests'));

  // Set rate limit reset time for one minute from now on first request
  if (numRequests === 1) {
    sessionStorage.setItem('rateLimitReset', new Date().getTime() + 60000);

    // One minute from now clear session storage
    setTimeout(() => {
      console.log('clearing session storage');
      sessionStorage.clear();
    }, 60000);
  }
  // Has the rate-limit reset?
  // const isLimitReset = new Date().getTime() > Number(sessionStorage.getItem('rateLimitReset'));

  // Log number of fetch requests
  sessionStorage.setItem('numRequests', ++numRequests);

  if (caller === 'avatar') {
    sessionStorage.setItem('delayTime', (delayTime += 1000));
    await delay(delayTime);
    return fetch(url, { signal, headers: { 'X-Use-Mock-Data': isMockedData } });
  } else if (caller === 'pops') {
    return fetch(url, { headers: { 'X-Use-Mock-Data': isMockedData } });
  } else if (caller === 'comments') {
    return fetch(url, { headers: { 'X-Use-Mock-Data': isMockedData } });
  } else {
    return fetch(url, { headers: { 'X-Use-Mock-Data': isMockedData } });
  }
}

// FETCH LIST OF POPULAR SUBREDDITS
// Populates the sidebar on first load with https://www.reddit.com/subreddits
export const getPopSubredditsList = createAsyncThunk(
  'subreddits/getPopSubredditsList',
  async (_, { rejectWithValue, getState }) => {
    try {
      // const response = await fetch(`https://www.reddit.com/TEST_REDDIT_ERROR_RESPONSE.json`);

      // Fetch from Frontend
      // const response = await fetchThrottle('https://www.reddit.com/subreddits.json', 'pops');

      // Fetch from Proxy Server
      const {
        subreddits: { isMockedData },
      } = getState();
      const response = await fetchThrottle(
        '/.netlify/functions/reddit-proxy?listing',
        'pops',
        { isMockedData },
      );

      // Fetch from Json-Server
      // const response = await fetchThrottle(`${apiRootTesting}${subredditsPathName}`, 'pops');

      console.log('res =>', response);
      if (!response.ok) {
        throw new Error(
          `HTTP error!
- Status: ${response.status}
- Cause: ${response.statusText}
- URL: ${response.url}`,
        );
      }
      const json = await response.json();
      return json.data.children;
    } catch (e) {
      console.error('Error:', e.message);
      return rejectWithValue(e.message);
    }
  },
  {
    // Cancel Thunk when Subreddits are cached
    condition(_, { getState }) {
      const {
        subreddits: { subreddits },
      } = getState();
      if (subreddits.length) {
        console.log('Popular Subreddits list cached, cancelling thunk =>');
        return false;
      }
    },
  },
);

// FETCH SUBREDDITS (POSTS) eg. /r/MapPorn
export const getSubredditPosts = createAsyncThunk(
  'subreddits/getSubredditPosts',
  async (postTitle, { rejectWithValue, getState }) => {
    try {
      // Check if Posts are cached
      const {
        subredditPosts: { posts },
      } = getState();
      if (typeof posts[postTitle] === 'object') {
        console.info('Posts cached, not fetching=> r/', postTitle);
        return posts[postTitle]; // Replace original Posts on early return
      }

      // Fetch from Frontend
      // const response = await fetchThrottle(`https://www.reddit.com/r/${postTitle}.json`, 'posts');

      // Fetch from Proxy Server
      const {
        subredditPosts: { isMockedData },
      } = getState();
      const response = await fetchThrottle(
        `/.netlify/functions/reddit-proxy?subreddit=${postTitle}`,
        'posts',
        { isMockedData },
      );

      // Fetch from Json-Server
      // const response = await fetchThrottle(`${apiRootTesting}r/${postTitle}`, 'posts');

      if (!response.ok) {
        throw new Error(
          `getSubredditPosts HTTP Error!
- Status: ${response.status}
- Cause: ${response.statusText}
- URL: ${response.url}`,
        );
      }
      const json = await response.json();
      return json.data.children;
    } catch (e) {
      console.error('Posts Error:', e.message);
      return rejectWithValue(e.message);
    }
  },
);

// FETCH SUBREDDIT POST COMMENTS
export const getSubredditComments = createAsyncThunk(
  'subreddits/getSubredditComments',
  async ({ permalink }, { rejectWithValue, getState }) => {
    try {
      // Fetch from Frontend
      // const response = await fetchThrottle(`https://www.reddit.com${permalink}.json`, 'comments');

      // Fetch from Proxy Server
      const {
        subredditComments: { isMockedData },
      } = getState();
      const response = await fetchThrottle(
        `/.netlify/functions/reddit-proxy?comments=${permalink}`,
        'comments',
        { isMockedData },
      );

      if (!response.ok) {
        throw new Error(
          `getSubredditComments HTTP error!
- Status: ${response.status}
- Cause: ${response.statusText}
- URL: ${response.url}`,
        );
      }
      const json = await response.json();

      /***************************************************
       * Comments Objects can be quite large,            *
       * this removes replies to replies of Comments.    *
       * We only need Comments/Replies a few levels deep *
       ***************************************************/

      const commentsArr = json[1].data.children;
      for (let comment of commentsArr) {
        // Ignore non comment objects of kind: 'more'
        if (comment.kind !== 'more') {
          // If replies property not empty
          if (comment.data.replies !== '') {
            const repliesArr = comment.data.replies.data.children;
            for (let reply of repliesArr) {
              // Ignore non-comment objects of kind: 'more'
              if (reply.kind !== 'more') {
                // Neuter reply by removing replies to a reply
                reply.data.replies = 'neutered';
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
  },
  {
    // Cancel Thunk when Comments are cached
    condition(permalink, { getState }) {
      const {
        subredditComments: { comments },
      } = getState();

      if (`t3_${permalink.postId}` === comments[0]?.data.parent_id) {
        console.log('Comments cached, cancelling Thunk =>', permalink);
        return false;
      }
    },
  },
);

// FETCH AVATARS FROM USER PROFILES
export const getUserAvatar = createAsyncThunk(
  'users/getUserAvatar',
  async (postAuthor, { rejectWithValue, signal }) => {
    try {
      // Avoid (re)dispatching deleted/undefined profiles
      if (postAuthor === '[deleted]' || postAuthor === undefined) {
        return ['[deleted]', 'PROFILE_DELETED_NO_AVATAR_DATA'];
      }

      // Fetch from Frontend
      // const response = await fetchThrottle(`https://www.reddit.com/user/${postAuthor}/about.json`, 'avatar', signal);

      // Fetch from Proxy Server
      const response = await fetchThrottle(
        `/.netlify/functions/reddit-proxy?avatar=${postAuthor}`,
        'avatar',
        { signal },
      );

      if (!response?.ok) {
        throw new Error(
          `getUserAvatar HTTP error!
- Status: ${response?.status}
- Cause: ${response?.statusText}
- URL: ${response?.url}`,
        );
      }
      const profile = await response.json();

      // Avoid (re)dispatching suspended profiles
      return profile.data.is_suspended ?
          [postAuthor, 'PROFILE_SUSPENDED_NO_AVATAR_DATA']
        : [postAuthor, profile.data.icon_img];
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    // Cancel Thunk when Avatar is cached/disabled
    condition(postAuthor, { getState }) {
      const {
        subredditPosts: { avatars, avatarsDisabled },
      } = getState();

      if (avatars[postAuthor] || avatarsDisabled) {
        console.log('Avatar cached, cancelling thunk =>', postAuthor);
        return false;
      }
    },
  },
);
