# Notes

## Rate-limits

100 queries per minute per OAuth client id if you are using OAuth authentication and 10 queries per minute if you are not using OAuth authentication.

### Setup

Create React App[^1]:
```sh
npx create-react-app my-app
cd my-app/
npm start
```

Import Bootstrap CSS in the src/index.js file:
`import 'bootstrap/dist/css/bootstrap.css';`

Import required react-bootstrap components within src/App.js file or your custom component files:
`import Button from 'react-bootstrap/Button';`
`import Card from 'react-bootstrap/Card';`

Add Jest for testing[^4]:
```sh
npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
```



### Technologies

#### Holder

https://github.com/imsky/holder

```jsx
<Card.Img variant="top" data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial" />
```


### Reddit

#### Testing-Server Data

Data for testing is pulled from reddit and saved in the data/ folder where it is accessed using json-server.

Scripts found in the data/scripts/ folder can load some data into the testing server from reddit

Files found in the data/subreddits/ folder are from `https://www.reddit.com/r/<filename>.json`

JQ filters for wrangling JSON data, and curl URLs revealing where local files originated found here. 

`jq` https://jqlang.github.io/jq for filtering JSON
`bat` https://github.com/sharkdp/bat cat clone for syntax highlighting

##### Posts data/subreddits/

```sh
# view subreddit posts
curl https://www.reddit.com/r/popular.json | jq '.data.children' | bat -l json

# view all titles
curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.title' | bat -l json
```


##### Images

```sh
# view images from popular
curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.preview.images[0].source.url' # images don't load in browser (CORS)

# load images from subreddit url prop, if it has img img will load if not nothing loads
curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.url'
# returns `https://i.redd.it/ssu9nfjyfzcc1.jpeg` if image exists, or somthing like: 
`https://www.reddit.com/r/AskReddit/comments/198mp35/how_will_you_react_if_joe_biden_becomes_president/` or 
`https://youtube.com/watch?v=386iVwP-bAA&amp;si=SAg9z216056Ov6nf` or
`https://twitter.com/SeanRossSapp/status/1747252570043588660` or some other non-image url

# Parsing gallery image URLS

# in order to parse gallery images 

# this works
https://preview.redd.it/ih9drrcwtkec1.png?width=108&amp;crop=smart&amp;auto=webp&amp;s=3790a5fe03f20add700bd3125e4c874d564c22f0

```


##### Comments data/comments/

```sh
# On reddit, when you click on a subreddit post from the initial listing from eg. `/r/MapPorn/` you will be taken to something like: `/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day`

# link to comments for individual posts from a subreddit can be found in the `permalink` property of a subreddits' JSON file
curl https://www.reddit.com/r/MapPorn.json | jq '.data.children[].data.permalink'
# returns 25 url paths: 
"/r/MapPorn/comments/1ahudqq/mapporn_discussion_thread_for_february_2024/"
"/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day/"
"/r/MapPorn/comments/1aikgos/foreign_language_speakers_in_europe/"
...

# so in order to render posts w/ comments we need to grab the JSON from `permalink` then render that data.

curl $(printf "https://www.reddit.com"$(curl https://www.reddit.com/r/MapPorn.json | jq -r '.data.children[0].data.permalink | rtrimstr("/")').json) | jq -r '.[].data.children[].data.body' | bat -l json

# first-level comments
curl https://www.reddit.com/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day.json | jq '.[1].data.children[].data.body'

# second level comments
curl https://www.reddit.com/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day.json | jq '.[1].data.children[].data.replies.data.children[].data.body'

# listing of subreddit comments
curl https://www.reddit.com/r/MapPorn/comments.json > ./data/comments/MapPornCommentsListing.json

# single post with comments URL anatomy
curl https://www.reddit.com/r/MapPorn/comments/1ahudqq/mapporn_discussion_thread_for_february_2024.json > ./data/comments/MapPornPostComments.json
# https://www.reddit.com/r/MapPorn/comments/<id>/<title>/

# num_comments inaccuracy (compare num_comments to actual comments array)
echo $(curl https://www.reddit.com/r/react.json | jq '.data.children[0].data.num_comments') - $(curl https://www.reddit.com/r/react/comments/ky2gf5/hello_members_of_rreact.json | jq '.[1].data.children | length') | bc


```


##### Searching data/search/

```sh
# search query
curl https://www.reddit.com/search.json\?q=cat > ./data/search/searchQuery.json

# search for cat and return JSON
curl https://www.reddit.com/search.json\?q=cat | jq . | bat -l json
```


##### User Profiles data/profiles/

```sh
# user overview
`curl https://www.reddit.com/user/Ltroid.json > ./data/profiles/userOverview.json`

# user icon and other data
`curl https://www.reddit.com/user/Ltroid/about.json > ./data/profiles/userAbout.json`

`curl https://www.reddit.com/user/Ltroid/about.json | jq '.data.icon_img'`
# returns `"https://styles.redditmedia.com/t5_2tu5t7/styles/profileIcon_snoobf84d9a3-2cea-42e8-972a-135e78ff10ff-headshot-f.png?width=256&amp;height=256&amp;crop=256:256,smart&amp;s=3ddc4418d0cbf20c8b6ed9b615506117ac15f7f3"`

# view user icon
curl $(curl https://www.reddit.com/user/Ltroid/about.json | jq '.data.icon_img' | jq -r 'match(".*png").string') | imgcat

```

#### Response Headers

Viewing / working with reddit ratelimits using Fetch API

Basic example:
```javascript

// define object to hold headers
const ob = {};

// build object of header values
fetch('https://www.reddit.com/r/Unexpected.json').then(res=>res.headers.forEach((v,k)=>ob[k]=v))

// work with header values
ob['x-ratelimit-remaining'] // => '95.0'
ob['x-ratelimit-used'] // => '5'
ob['x-ratelimit-reset'] // => '225'
```

Building headers object example:
```javascript

const fetchBodyWithHeaders = async (url) => {
    const response = await fetch(url);
    const json = await response.json();

    const headerReportTo = response.headers.get('report-to');
    
    const hob = {};

    response.headers.forEach((v,k)=>{
        // console.log({[k]:v})
        hob[k] = v;
    });

    // Parsing report-to header (multiple objects won't parse nicely, needs love)

    // create array of objects
    const headerReportToArr = headerReportTo.split('}, ');

    // trim '}' from end of last element (now all els are missing a closing '}')
    headerReportToArr[headerReportToArr.length-1] = 
        headerReportToArr[headerReportToArr.length-1].slice(0, -1);

    const reportToVals = [];
    
    // add closing '}' to end of each element and build reportToVals
    for (const hgroup of headerReportToArr) {
        // console.log('report-to hgroup', JSON.parse(hgroup + '}').group, JSON.parse(hgroup + '}'))
        reportToVals.push(JSON.parse(hgroup + '}'));
    }

    hob['report-to'] = reportToVals; // update headers object
    hob['nel'] = JSON.parse(hob['nel']); // parse this fugly one too
    console.log('hob =>', hob); // headers object
    console.log('json =>', json) // body object
}

fetchBodyWithHeaders('https://www.reddit.com/r/react.json');
```

#### URLs & Hyperlinks


URL redirected from: https://i.redd.it/dcjc97hi3mcc1.jpeg
to: https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fdcjc97hi3mcc1.jpeg
prepends: https://www.reddit.com/media?url=

#### type prefixes

t1_	Comment  
t2_	Account  
t3_	Link  
t4_	Message  
t5_	Subreddit  
t6_	Award  





[^1]: https://create-react-app.dev/docs/getting-started
[^4]: https://jestjs.io/docs/tutorial-react
