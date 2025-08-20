import fetch from "node-fetch";

export default async function handler(event, context) {

  // Read query params
  const params = event.queryStringParameters || {};
  const subreddit = params.subreddit || 'popular';
  let redditUrl;

  if (params.listing === 'popularList') {
    redditUrl = 'https://www.reddit.com/subreddits.json';
  } else {
    redditUrl = `https://www.reddit.com/r/${subreddit}.json`;
  };
  
  if (params.comments) {
    const permalink = params.comments || '';
    redditUrl = `https://www.reddit.com${permalink}.json`;
  };

  if (params.avatar) {
    const postAuthor = params.avatar || '';
    redditUrl = `https://www.reddit.com/user/${postAuthor}/about.json`;
  }

  try {
    const redditRes = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedditProxy/1.0)'
      }, 
      context
    });
    if (!redditRes.ok) throw new Error(`Reddit responded with ${redditRes.status}`);
    const data = await redditRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // };

  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({error: err.message}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
