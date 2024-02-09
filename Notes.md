## Notes

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

```js
<Card.Img variant="top" data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial" />
```


### Reddit

#### Data

https://jqlang.github.io/jq/manual/  
```sh

# POSTS
jq '.data.children[] | select(.data.title == "Gratefulness")' ./popular.json # select post by title
jq '.data.children[].data.title' ./popular.json # view all titles

# COMMENTS
curl https://www.reddit.com/r/DnD/comments/17mu96z/oc_runic_dice_bue_cats_eye_dice_set_and_box.json | jq . > comments.json # single post comments
curl https://www.reddit.com/r/DnD/comments/17mu96z/oc_runic_dice_bue_cats_eye_dice_set_and_box.json | jq '.[1].data.children[].data.body'

# link to comments for individual posts from a subreddit can be found in the `permalink` property of a subreddits' json file
curl https://www.reddit.com/r/MapPorn.json | jq '.data.children[].data.permalink'
# returns 25 url fragments: 
"/r/MapPorn/comments/1ahudqq/mapporn_discussion_thread_for_february_2024/"
"/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day/"
"/r/MapPorn/comments/1aikgos/foreign_language_speakers_in_europe/"
...
# all from ...MapPorn.json: 
"permalink": "/r/MapPorn/comments/1ahudqq/mapporn_discussion_thread_for_february_2024/",




jq '.[1].data.children[].data.body' comments.json # first level comments
jq '.[1].data.children[].data.replies.data.children[].data.body' comments.json # second level comments

curl https://www.reddit.com/r/MapPorn/comments.json > ./data/MapPornCommentsListing.json # listing of subreddit comments

# single post comment URL anatomy
curl https://www.reddit.com/r/MapPorn/comments.json > ./data/MapPornCommentsListing.json
https://www.reddit.com/r/MapPorn/comments/18vyfbl/mapporn_discussion_thread_for_january_2024/
https://www.reddit.com/r/MapPorn/comments/<id>/<title>/



# IMAGES
# view images from popular
jq '.data.children[].data.preview.images[0].source.url' popular.json # images don't load in browser (CORS)
curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.preview.images[0].source.url' # images don't load in browser (CORS)

# load images from subreddit url prop, if it has img img will load if not nothing loads
curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.url'
# returns 
`https://i.redd.it/ssu9nfjyfzcc1.jpeg` if image exists, or somthing like: 
`https://www.reddit.com/r/AskReddit/comments/198mp35/how_will_you_react_if_joe_biden_becomes_president/` or 
`https://youtube.com/watch?v=386iVwP-bAA&amp;si=SAg9z216056Ov6nf` or
`https://twitter.com/SeanRossSapp/status/1747252570043588660` or some other non-image url

# SEARCHING

curl https://www.reddit.com/search.json\?q=cat | jq . # search for cat and return JSON


# USER ICON AND OTHER DATA

`curl https://www.reddit.com/user/Ltroid/about.json > userAbout.json` # locally stored user data

`curl https://www.reddit.com/user/Ltroid/about.json | jq '.data.icon_img'`
# returns `"https://styles.redditmedia.com/t5_2tu5t7/styles/profileIcon_snoobf84d9a3-2cea-42e8-972a-135e78ff10ff-headshot-f.png?width=256&amp;height=256&amp;crop=256:256,smart&amp;s=3ddc4418d0cbf20c8b6ed9b615506117ac15f7f3"`
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
[^2]: https://reactstrap.github.io/?path=/story/home-installation--page
[^4]: https://jestjs.io/docs/tutorial-react