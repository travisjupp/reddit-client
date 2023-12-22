 // filter popular.json

 export const getSubredditTitles = async () => {
   //  const response = await fetch('http://localhost:3000/data/popular.json');
   //  const response = await fetch('https://www.reddit.com/subreddits.json');
   //  const response = await fetch('http://localhost:3000/data/subreddits.json');
   //  const response = await fetch('http://localhost:3000/posts/1/comments');
    const response = await fetch('http://localhost:3000/posts');
    const json = await response.json();
    console.log(json);
 }

//  console.log('./popular.json'.json());
//  fetch('http://localhost:3000/data/popular.json')
//  .then((response) => {
//      console.log('response =>', response);
//      response.json()
//  })
//  .then((json) => console.log('json =>',json));