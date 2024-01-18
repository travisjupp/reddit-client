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

#### jq
https://jqlang.github.io/jq/manual/  
```sh
# select post by title
jq '.data.children[] | select(.data.title == "Gratefulness")' ./popular.json
# view all titles
jq '.data.children[].data.title'  ./popular.json

# view comments
curl https://www.reddit.com/r/DnD/comments/17mu96z/oc_runic_dice_bue_cats_eye_dice_set_and_box.json | jq . > comments.json

curl https://www.reddit.com/r/DnD/comments/17mu96z/oc_runic_dice_bue_cats_eye_dice_set_and_box.json | jq '.[1].data.children[].data.body'

jq '.[1].data.children[].data.body' comments.json # first level comments
jq '.[1].data.children[].data.replies.data.children[].data.body' comments.json # second level comments

# view images from popular
jq '.data.children[].data.preview.images[0].source.url' popular.json # images don't load in browser (CORS)

curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.preview.images[0].source.url' # images don't load in browser (CORS)

# LOADING IMAGES
# load images from subreddit url prop, if it has img img will load if not nothing loads
curl https://www.reddit.com/r/popular.json | jq '.data.children[].data.url'
# returns 
`https://i.redd.it/ssu9nfjyfzcc1.jpeg` if image exists, or somthing like: 
`https://www.reddit.com/r/AskReddit/comments/198mp35/how_will_you_react_if_joe_biden_becomes_president/` or 
`https://youtube.com/watch?v=386iVwP-bAA&amp;si=SAg9z216056Ov6nf` or
`https://twitter.com/SeanRossSapp/status/1747252570043588660` or some other non-image url
```

### Reddit

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