
import './App.css';
import Header from './features/Header/Header.js';
import Post from './features/Post/Post.js';
import BSScreenSize from './utils/BSScreenSize/BSScreenSize.js';

function App() {

  return (
    <>
    <BSScreenSize />
      <Header />
      <Post />
    </>
  );
}

export default App;
