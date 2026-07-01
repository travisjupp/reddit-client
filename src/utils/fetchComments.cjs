const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// CONFIG
const SUBREDDIT_FILE =
  '/Users/travisjupp/Documents/projects/reddit-client/src/mockData/subreddits/Home.json';
const OUTPUT_DIR =
  '/Users/travisjupp/Documents/projects/reddit-client/src/mockData/comments';

// Create output dir if none
if (!fs.existsSync(OUTPUT_DIR)) {
  console.log(`Output Directory doesn't exist, creating: \n ${OUTPUT_DIR}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  // Read subreddit.json file
  const subredditData = JSON.parse(fs.readFileSync(SUBREDDIT_FILE));

  // Extract permalinks
  const posts = subredditData.data.children;
  console.log(`Found ${posts.length} posts. DL'n data...`);

  // Launch playwright browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
,
  });
  const page = await context.newPage();

  // Process subreddit post permalinks
  for (let i = 0; i < posts.length; i++) {
    const permalink = posts[i].data.permalink;
    const postId = posts[i].data.id;
    const jsonUrl = `https://old.reddit.com${permalink}.json`;
    const targetPath = path.join(OUTPUT_DIR, `${postId}.json`);

    // Skip already downloaded posts
    if (fs.existsSync(targetPath)) {
      console.log(`[${i + 1}/${posts.length}] Skipping existing ID: ${postId}`);
      continue;
    }
    let success = false;
    let attempts = 0;

    while (!success && attempts < 2) {
      attempts++;
    try {
      console.log(`[${i + 1}/${posts.length}] Fetching: ${jsonUrl}`);
      // Intercept raw background network response
      const responsePromise = page.waitForResponse(
          response => response.url() === jsonUrl && response.status() === 200,
          { timeout: 15000 }
        );

      // Navigate to JSON URL directly
      await page.goto(jsonUrl, { waitUntil: 'commit' });

      // Wait for the response to resolve and grab the body
      const response = await responsePromise;
      const jsonBody = await response.json();

      // Save JSON to mock folder
      fs.writeFileSync(targetPath, JSON.stringify(jsonBody, null, 2));
        console.log(`Saved: ${postId}.json`);
        success = true;

    } catch (e) {
        console.error(`Attempt ${attempts} failed for ${postId}: ${error.message}`);
        if (attempts >= 2) {
          console.error(`Giving up on ${postId}. Moving to next post.`);
        }
        // Take a longer rest if it fails to let rate-limits cool
        await new Promise(r => setTimeout(r, 10000));
    }
      // Wait 4-6 secs between calls to thwart rate-limiting
      const delay = Math.floor(Math.random() * 3000) + 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  await browser.close();
  console.log(`Finished DL'n comments~`);
})();

