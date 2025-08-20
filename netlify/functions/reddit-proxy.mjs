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

  // if (params.listing === 'popularList') {
  //   redditUrl = `https://www.reddit.com/subreddits.json`;
  // }

  if (params.has('subreddit')) {
    const subreddit = params.get('subreddit');
    redditUrl = `https://www.reddit.com/r/${subreddit}.json`;
    console.log('redditUrl', redditUrl);
  };

  // if (params.subreddit) {
  //   const subreddit = params.subreddit || 'popular';
  //   redditUrl = `https://www.reddit.com/r/${subreddit}.json`;
  // };
  
  if (params.has('comments')) {
    const permalink = params.get('comments');
    redditUrl = `https://www.reddit.com${permalink}.json`;
    console.log('redditUrl', redditUrl);
  };

  // if (params.comments) {
  //   const permalink = params.comments || '';
  //   redditUrl = `https://www.reddit.com${permalink}.json`;
  // };

  if (params.has('avatar')) {
    const postAuthor = params.get('avatar');
    redditUrl = `https://www.reddit.com/user/${postAuthor}/about.json`;
    console.log('redditUrl', redditUrl);
  }

  // if (params.avatar) {
  //   const postAuthor = params.avatar || '';
  //   redditUrl = `https://www.reddit.com/user/${postAuthor}/about.json`;
  // }

  // if (!redditUrl) {
  //   return new Response(JSON.stringify({data: 'no redditUrl'}), {
  //     status: 200,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*'
  //     }
  //   });
  // };

  try {
    const redditRes = await fetch(redditUrl, {
      headers: {
        // 'User-Agent': 'Mozilla/5.0 (compatible; RedditProxy/1.0)'
        'User-Agent': 'webapp:com.tjupp.redditlite:v1.0 (by /u/tjupp)'

      }, 
      context
    });
    if (!redditRes.ok) throw new Error(`Reddit responded with ${redditRes.status}`);
    const data = await redditRes.json();
console.log('\n\n\nDATA\n---------\n', data);
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
