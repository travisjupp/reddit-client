
import './App.css';
import Header from './features/Header/Header';
import Post from './features/Post/Post';
import BSScreenSize from './utils/BSScreenSize/BSScreenSize';

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
