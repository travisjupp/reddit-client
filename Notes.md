## Notes

### Setup

Create React App:
```sh
npx create-react-app my-app
cd my-app/
npm start
```

Add Reactstrap:
```sh
npm i bootstrap
npm i reactstrap react react-dom
```

Import Bootstrap CSS in the src/index.js file:
`import 'bootstrap/dist/css/bootstrap.css';`

Import required reactstrap components within src/App.js file or your custom component files:
`import { Button } from 'reactstrap';`

Add Jest for testing:
```sh
npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
```


https://jestjs.io/docs/tutorial-react
https://create-react-app.dev/docs/getting-started
https://reactstrap.github.io/?path=/story/home-installation--page
https://github.com/reactstrap/reactstrap





### jq
https://jqlang.github.io/jq/manual/  
```sh
# select post by title
jq '.data.children[] | select(.data.title == "Gratefulness")' ./popular.json
# view all titles
jq '.data.children[].data.title'  ./popular.json
```