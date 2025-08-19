import fetch from "node-fetch";

export default async function handler(event, context) {
  // Read query params
  const params = event.queryStringParameters;
  console.log('params', params);
  const subreddit = params.subreddit || 'popular';
  const redditUrl = `https://www.reddit.com/r/${subreddit}.json`;

  try {
    const redditRes = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedditProxy/1.0)'
      }
    });
    if (!redditRes.ok) throw new Error(`Reddit responded with ${redditRes.status}`);
    const data = await redditRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
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
