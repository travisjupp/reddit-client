// filter popular.json
const apiRoot = 'http://localhost:8000';
const subredditsPathName = '/subreddits/1';

export const getSubredditTitles = async () => {
  try {
    
    //  const response = await fetch('https://www.reddit.com/subreddits.json');
    // const response = await fetch('http://localhost:8000/subreddits/1');
    const response = await fetch(`${apiRoot}${subredditsPathName}`);
    const json = await response.json();
    console.log(json);
    console.log(json.data.children[0].data.title);
    console.log(json.data.children[0].data.url);
    console.log(json.data.children[1].data.title);
    console.log(json.data.children[1].data.url);
  } catch (e) {
    console.log('error', e);
    console.log('error message', e.message);
  }
}

//  console.log('./popular.json'.json());
//  fetch('http://localhost:3000/data/popular.json')
//  .then((response) => {
//      console.log('response =>', response);
//      response.json()
//  })
//  .then((json) => console.log('json =>',json));