// import fetch from "node-fetch";

export default async function handler(request, context) {

  // console.log('REQUEST', request);
  // Read search params
  // const params = request.queryStringParameters || {};
  const params = new URLSearchParams(request.url.split('?')[1]);
  let redditUrl;

  console.log('PARAMS', params);

  if (params.has('listing')) {
    redditUrl = `https://www.reddit.com/subreddits.json`;
    console.log('redditUrl', redditUrl);
  }

  if (params.has('subreddit')) {
    const subreddit = params.get('subreddit');
    redditUrl = `https://www.reddit.com/r/${subreddit}.json`;
    console.log('redditUrl', redditUrl);
  };

  if (params.has('avatar')) {
    const postAuthor = params.get('avatar');
    redditUrl = `https://www.reddit.com/user/${postAuthor}/about.json`;
    console.log('redditUrl', redditUrl);
  }

  try {
    const redditRes = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'webapp:com.tjupp.redditlite:v1.0 (by /u/tjupp)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
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

  } catch (err) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      statusCode: 502,
      body: JSON.stringify({error: err.message}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
