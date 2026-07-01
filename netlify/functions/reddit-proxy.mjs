const fs = require('fs');
const path = require('path');

export default async function handler(request, context) {
  console.log('=== PROXY HANDLER CALLED ===');
  console.log('Request URL:', request.url);

  const useMockDataHeader = request.headers.get('x-use-mock-data');
  const forceMockData = useMockDataHeader === 'true';

  // Parse search params
  const urlParts = request.url.split('?');
  const params = new URLSearchParams(urlParts[1] || '');

  let redditUrl;
  let type = ''; // Track request type
  let identifier = ''; // Track subreddit name or user handle

  if (params.has('listing')) {
    type = 'listing';
    redditUrl = 'https://www.reddit.com/subreddits.json';
  } else if (params.has('subreddit')) {
    type = 'subreddit';
    identifier = params.get('subreddit');
    redditUrl = `https://www.reddit.com/r/${identifier}.json`;
  } else if (params.has('comments')) {
    type = 'comments';
    identifier = params.get('comments');
    redditUrl = `https://www.reddit.com${identifier}.json`;
  } else if (params.has('avatar')) {
    type = 'avatar';
    identifier = params.get('avatar');
    redditUrl = `https://www.reddit.com/user/${identifier}/about.json`;
  }

  if (!redditUrl && !forceMockData) {
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

  // Mock file helper
  const getMockData = async (reqType, id) => {
    if (reqType === 'listing') {
      return await import('../../src/mockData/subreddits.json');
      // const targetPath = path.resolve(__dirname, '../../src/mockData/subreddits.json');
      // const data = fs.readFileSync(targetPath, 'utf8');
      // return JSON.parse(data);
    }
    if (reqType === 'subreddit') {
      // return await import(`../../src/mockData/subreddits/${id}.json`);
      const targetPath = path.resolve(__dirname, `../../src/mockData/subreddits/${id}.json`);
      const data = fs.readFileSync(targetPath, 'utf8');
      return JSON.parse(data);
    }
    if (reqType === 'comments') {
      try {
      // Extract comment id e.g., '1udgaof'
      const commentIdMatch = id.match(/comments\/([^\/]+)/);
      const commentId = commentIdMatch ? commentIdMatch[1] : id;
      // Import comment json e.g., '1udgaof.json'
      const targetFilePath = path.resolve(__dirname, `../../src/mockData/comments/${commentId}.json`);
        if (!fs.existsSync(targetFilePath)) {
          console.log(`Mock file for ${commentId} missing. Serving fallback.`);
          const fallbackPath = path.resolve(__dirname, `../../src/mockData/comments/comment_1.json`);
          const fallbackData = fs.readFileSync(fallbackPath, 'utf8');
          return JSON.parse(fallbackData);
        }
        const fileContent = fs.readFileSync(targetFilePath, 'utf8');
        return JSON.parse(fileContent);
      } catch (e) {
        console.error("Failed to load comment mock context:", e.message);
        return { error: 'Failed to parse mock data structure' };
      }
    }
    // TODO Avatars
    return { error: 'Unknown mock context' };
  };

  // Early return Mock Data if Redux specifies
  if (forceMockData) {
    console.log(`[REDUX FORCED] Serving mock data for type: ${type}`);
    try {
      const data = await getMockData(type, identifier);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (mockErr) {
      return new Response(
        JSON.stringify({
          error: 'Failed to load forced mock file',
          details: mockErr.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  // Fetch from Reddit or fallback to Mock Data
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

    // Trigger error fallback
    if (!redditRes.ok) {
      throw new Error(
        `Reddit responded with ${redditRes.status}: ${redditRes.statusText}`,
      );
    }

    const data = await redditRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.warn(
      '=== REDDIT BLOCKED OR FAILING -> FALLING BACK TO MOCK DATA ===',
    );
    console.warn('Reason:', err.message);

    try {
      const fallbackData = await getMockData(type, identifier);

      // Return 200 with Mock Data and custom mock header
      return new Response(JSON.stringify(fallbackData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Data-Source': 'fallback-mock',
        },
      });
    } catch (fallbackErr) {
      console.error(
        'Critical Error: Fallback mock files missing!',
        fallbackErr.message,
      );
      return new Response(
        JSON.stringify({
          error: 'Reddit connection failed and local mock files are missing.',
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }
  }
}
