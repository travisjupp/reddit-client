const fs = require('fs');
const path = require('path');

const TARGET_DIR =
  '/Users/travisjupp/Documents/projects/reddit-client/src/mockData/comments/raw/';

const files = fs.readdirSync(TARGET_DIR);

files.forEach(file => {
  if (!file.endsWith('.json')) return;

  const filePath = path.join(TARGET_DIR, file);

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(rawData);

    // Get Reddit post ID from first post object
    const postId = parsed[0].data.children[0].data.id;

    if (postId) {
      const newPath = path.join(TARGET_DIR, `${postId}.json`);
      fs.renameSync(filePath, newPath);
      console.log(`Renamed: ${file} => ${postId}.json`);
    }
  } catch (err) {
    console.error(`Skipping ${file}: File structure mismatch or empty.`);
  }
});
