export default async function handler(request, context) {
  console.log('=== PROXY HANDLER CALLED ===');
  console.log('Request URL:', request.url);

  // Parse search params
  const urlParts = request.url.split('?');
  console.log('URL Parts:', urlParts);

  const params = new URLSearchParams(urlParts[1] || '');
  let redditUrl;

  console.log('PARAMS:', Array.from(params.entries()));

  let data;
  if (params.has('listing')) {
    redditUrl = `https://www.reddit.com/subreddits.json`;
    // TODO Manage mockData conditionally from Redux store
    // We're just shoe-horning it in here
    data = await import('../../src/mockData/subreddits.json');
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (params.has('subreddit')) {
    const subreddit = params.get('subreddit');
    redditUrl = `https://www.reddit.com/r/${subreddit}.json`;
    // TODO Manage mockData conditionally from Redux store
    // We're just shoe-horning it in here
    data = await import(`../../src/mockData/subreddits/${subreddit}.json`);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (params.has('comments')) {
    const permalink = params.get('comments');
    redditUrl = `https://www.reddit.com${permalink}.json`;
    // TODO Setup mockData for Comments
    console.log('Setting redditUrl for comments:', redditUrl);
  }

  if (params.has('avatar')) {
    const postAuthor = params.get('avatar');
    redditUrl = `https://www.reddit.com/user/${postAuthor}/about.json`;
    console.log('Setting redditUrl for avatar:', redditUrl);
  }

  if (!redditUrl) {
    console.log('ERROR: No redditUrl set');
    return new Response(
      JSON.stringify({ error: 'Missing required parameters' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }

  try {
    console.log('Fetching from Reddit:', redditUrl);

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));

    const redditRes = await fetch(redditUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    console.log('Reddit response status:', redditRes.status);

    if (!redditRes.ok) {
      const errorText = await redditRes.text();
      // console.log('Error response body:', errorText);
      throw new Error(
        `Reddit responded with ${redditRes.status}: ${redditRes.statusText}`,
      );
    }

    const data = await redditRes.json();
    console.log('Successfully parsed Reddit JSON response');

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('=== PROXY ERROR ===');
    console.error('Error type:', err.constructor.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
